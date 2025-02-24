interface CachedData<T> {
    data: T;
    timestamp: number;
    expiry?: number;
    version?: string;
    compressed?: boolean;
    priority?: number;
    group?: string;
}

interface CacheConfig {
    duration?: number;
    maxSize?: number;
    version?: string;
    prefix?: string;
    compression?: boolean;
    useIndexedDB?: boolean;
    defaultPriority?: number;
}

interface CacheStats {
    totalItems: number;
    totalSize: number;
    oldestItem: number;
    newestItem: number;
    compressedItems: number;
    groupStats: Record<string, number>;
    priorityStats: Record<number, number>;
}

type CacheEventType = 'set' | 'remove' | 'clear' | 'expired';
type CacheEventListener = (event: CacheEventType, key: string, value?: unknown) => void;

const DEFAULT_CONFIG: CacheConfig = {
    duration: 30 * 60 * 1000, // 30 minutes
    maxSize: 5 * 1024 * 1024, // 5MB
    version: '1.0',
    prefix: 'app_cache_',
    compression: true,
    useIndexedDB: true,
    defaultPriority: 1
};

class CacheManager {
    private static instance: CacheManager;
    private config: CacheConfig;
    private eventListeners: Set<CacheEventListener> = new Set();
    private indexedDB: IDBDatabase | null = null;

    private constructor(config: Partial<CacheConfig> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };
        this.setupPeriodicCleanup();
        if (this.config.useIndexedDB) {
            this.initIndexedDB();
        }
    }

    public static getInstance(config?: Partial<CacheConfig>): CacheManager {
        if (!CacheManager.instance) {
            CacheManager.instance = new CacheManager(config);
        }
        return CacheManager.instance;
    }

    private async initIndexedDB(): Promise<void> {
        try {
            const request = indexedDB.open('CacheStorage', 1);
            
            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains('cache')) {
                    db.createObjectStore('cache', { keyPath: 'key' });
                }
            };

            request.onsuccess = (event) => {
                this.indexedDB = (event.target as IDBOpenDBRequest).result;
            };

            request.onerror = (event) => {
                console.error('IndexedDB initialization failed:', event);
            };
        } catch (error) {
            console.error('Error initializing IndexedDB:', error);
        }
    }

    public subscribe(listener: CacheEventListener): () => void {
        this.eventListeners.add(listener);
        return () => this.eventListeners.delete(listener);
    }

    private notifyListeners(event: CacheEventType, key: string, value?: unknown): void {
        this.eventListeners.forEach(listener => listener(event, key, value));
    }

    private async compressData(data: string): Promise<string> {
        if (!this.config.compression) return data;
        
        try {
            const blob = new Blob([data]);
            const compressed = await new Response(blob.stream().pipeThrough(new CompressionStream('gzip'))).blob();
            return await compressed.text();
        } catch (error) {
            console.error('Compression failed:', error);
            return data;
        }
    }

    private async decompressData(data: string): Promise<string> {
        if (!this.config.compression) return data;

        try {
            const blob = new Blob([data]);
            const decompressed = await new Response(blob.stream().pipeThrough(new DecompressionStream('gzip'))).blob();
            return await decompressed.text();
        } catch (error) {
            console.error('Decompression failed:', error);
            return data;
        }
    }

    public async setMany<T>(items: { key: string; data: T; duration?: number; priority?: number; group?: string }[]): Promise<void> {
        await Promise.all(items.map(item => 
            this.set(item.key, item.data, item.duration, item.priority, item.group)
        ));
    }

    public async getMany<T>(keys: string[]): Promise<(T | null)[]> {
        return await Promise.all(keys.map(key => this.get<T>(key)));
    }

    public async set<T>(
        key: string, 
        data: T, 
        customDuration?: number,
        priority: number = this.config.defaultPriority!,
        group?: string
    ): Promise<void> {
        const fullKey = this.getFullKey(key);
        const cacheItem: CachedData<T> = {
            data,
            timestamp: Date.now(),
            expiry: Date.now() + (customDuration || this.config.duration!),
            version: this.config.version,
            priority,
            group
        };

        try {
            const serializedData = JSON.stringify(cacheItem);
            const compressedData = await this.compressData(serializedData);
            const currentSize = await this.getCacheSize();
            
            if (this.shouldUseIndexedDB(compressedData.length)) {
                await this.setInIndexedDB(fullKey, compressedData);
            } else {
                if (this.config.maxSize) {
                    const newSize = currentSize + compressedData.length;
                    if (newSize > this.config.maxSize) {
                        await this.evictItems(compressedData.length, priority);
                    }
                }
                localStorage.setItem(fullKey, compressedData);
            }

            this.notifyListeners('set', key, data);
        } catch (error) {
            console.error('Error setting cache:', error);
            if (error instanceof Error && error.name === 'QuotaExceededError') {
                await this.evictItems(undefined, priority);
                await this.set(key, data, customDuration, priority, group);
            }
        }
    }

    private shouldUseIndexedDB(dataSize: number): boolean {
        return Boolean(this.config.useIndexedDB && this.indexedDB && dataSize > 1024 * 1024); // > 1MB
    }

    private async setInIndexedDB(key: string, value: string): Promise<void> {
        if (!this.indexedDB) return;

        return new Promise((resolve, reject) => {
            const transaction = this.indexedDB!.transaction(['cache'], 'readwrite');
            const store = transaction.objectStore('cache');
            const request = store.put({ key, value });

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    private async getFromIndexedDB(key: string): Promise<string | null> {
        if (!this.indexedDB) return null;

        return new Promise((resolve, reject) => {
            const transaction = this.indexedDB!.transaction(['cache'], 'readonly');
            const store = transaction.objectStore('cache');
            const request = store.get(key);

            request.onsuccess = () => resolve(request.result?.value || null);
            request.onerror = () => reject(request.error);
        });
    }

    public async get<T>(key: string): Promise<T | null> {
        const fullKey = this.getFullKey(key);
        try {
            let cached = localStorage.getItem(fullKey);
            
            if (!cached && this.config.useIndexedDB) {
                cached = await this.getFromIndexedDB(fullKey);
            }
            
            if (!cached) return null;

            const decompressedData = await this.decompressData(cached);
            const cacheItem: CachedData<T> = JSON.parse(decompressedData);
            
            if (
                cacheItem.version !== this.config.version ||
                (cacheItem.expiry && Date.now() > cacheItem.expiry)
            ) {
                await this.remove(key);
                this.notifyListeners('expired', key);
                return null;
            }

            return cacheItem.data;
        } catch (error) {
            console.error('Error reading cache:', error);
            return null;
        }
    }

    public async getByGroup<T>(group: string): Promise<T[]> {
        const items = await this.getAllItems();
        return items
            .filter(item => item.group === group)
            .map(item => item.data as T);
    }

    private async getAllItems(): Promise<CachedData<unknown>[]> {
        const items: CachedData<unknown>[] = [];

        // Get items from localStorage
        for (const key of Object.keys(localStorage)) {
            if (key.startsWith(this.config.prefix!)) {
                try {
                    const cached = localStorage.getItem(key);
                    if (cached) {
                        const decompressedData = await this.decompressData(cached);
                        items.push(JSON.parse(decompressedData));
                    }
                } catch (error) {
                    console.error(`Error reading cache item ${key}:`, error);
                }
            }
        }

        // Get items from IndexedDB
        if (this.indexedDB) {
            try {
                const transaction = this.indexedDB.transaction(['cache'], 'readonly');
                const store = transaction.objectStore('cache');
                const request = store.getAll();

                await new Promise((resolve, reject) => {
                    request.onsuccess = () => {
                        request.result.forEach(async (item) => {
                            try {
                                const decompressedData = await this.decompressData(item.value);
                                items.push(JSON.parse(decompressedData));
                            } catch (error) {
                                console.error(`Error reading IndexedDB item:`, error);
                            }
                        });
                        resolve(undefined);
                    };
                    request.onerror = () => reject(request.error);
                });
            } catch (error) {
                console.error('Error reading from IndexedDB:', error);
            }
        }

        return items;
    }

    private async evictItems(requiredSpace?: number, minPriority: number = 0): Promise<void> {
        const items = await this.getAllItems();
        const sortedItems = items
            .filter(item => (item.priority || 0) <= minPriority)
            .sort((a, b) => {
                // Сначала по приоритету, потом по времени
                const priorityDiff = (a.priority || 0) - (b.priority || 0);
                if (priorityDiff !== 0) return priorityDiff;
                return a.timestamp - b.timestamp;
            });

        let freedSpace = 0;
        for (const item of sortedItems) {
            await this.remove(item.data as string);
            freedSpace += JSON.stringify(item).length;

            if (requiredSpace && freedSpace >= requiredSpace) {
                break;
            }
        }
    }

    public async remove(key: string): Promise<void> {
        const fullKey = this.getFullKey(key);
        localStorage.removeItem(fullKey);
        
        if (this.indexedDB) {
            const transaction = this.indexedDB.transaction(['cache'], 'readwrite');
            const store = transaction.objectStore('cache');
            store.delete(fullKey);
        }

        this.notifyListeners('remove', key);
    }

    public async clear(prefix?: string): Promise<void> {
        const searchPrefix = prefix || this.config.prefix;
        
        // Clear localStorage
        Object.keys(localStorage)
            .filter(key => key.startsWith(searchPrefix!))
            .forEach(key => localStorage.removeItem(key));

        // Clear IndexedDB
        if (this.indexedDB) {
            const transaction = this.indexedDB.transaction(['cache'], 'readwrite');
            const store = transaction.objectStore('cache');
            store.clear();
        }

        this.notifyListeners('clear', searchPrefix!);
    }

    public async getStats(): Promise<CacheStats> {
        const items = await this.getAllItems();
        const groupStats: Record<string, number> = {};
        const priorityStats: Record<number, number> = {};
        let compressedItems = 0;

        items.forEach(item => {
            if (item.compressed) compressedItems++;
            if (item.group) {
                groupStats[item.group] = (groupStats[item.group] || 0) + 1;
            }
            const priority = item.priority || 0;
            priorityStats[priority] = (priorityStats[priority] || 0) + 1;
        });

        return {
            totalItems: items.length,
            totalSize: await this.getCacheSize(),
            oldestItem: Math.min(...items.map(item => item.timestamp)),
            newestItem: Math.max(...items.map(item => item.timestamp)),
            compressedItems,
            groupStats,
            priorityStats
        };
    }

    private async getCacheSize(): Promise<number> {
        let size = 0;

        // Size in localStorage
        Object.keys(localStorage)
            .filter(key => key.startsWith(this.config.prefix!))
            .forEach(key => {
                size += localStorage.getItem(key)?.length || 0;
            });

        // Size in IndexedDB
        if (this.indexedDB) {
            const transaction = this.indexedDB.transaction(['cache'], 'readonly');
            const store = transaction.objectStore('cache');
            const request = store.getAll();

            await new Promise((resolve) => {
                request.onsuccess = () => {
                    request.result.forEach(item => {
                        size += item.value.length;
                    });
                    resolve(undefined);
                };
            });
        }

        return size;
    }

    private getFullKey(key: string): string {
        return `${this.config.prefix}${key}`;
    }

    private setupPeriodicCleanup(): void {
        setInterval(() => this.cleanupOldCache(), 60 * 60 * 1000);
    }

    public cleanupOldCache(): void {
        const now = Date.now();
        Object.keys(localStorage)
            .filter(key => key.startsWith(this.config.prefix!))
            .forEach(key => {
                try {
                    const cached = localStorage.getItem(key);
                    if (cached) {
                        const cacheItem: CachedData<unknown> = JSON.parse(cached);
                        if (
                            cacheItem.version !== this.config.version ||
                            (cacheItem.expiry && now >= cacheItem.expiry)
                        ) {
                            localStorage.removeItem(key);
                        }
                    }
                } catch (error) {
                    console.error(`Error cleaning cache for key ${key}:`, error);
                    localStorage.removeItem(key);
                }
            });
    }
}

export const cacheManager = CacheManager.getInstance();

export type { 
    CachedData, 
    CacheConfig, 
    CacheStats, 
    CacheEventType, 
    CacheEventListener 
}; 