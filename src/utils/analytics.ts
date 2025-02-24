interface PerformanceMetric {
    name: string;
    value: number;
    rating: 'good' | 'needs-improvement' | 'poor';
    timestamp: number;
}

interface ErrorEvent {
    message: string;
    source?: string;
    lineno?: number;
    colno?: number;
    error?: Error;
    timestamp: number;
}

interface UserSession {
    sessionId: string;
    startTime: number;
    lastActive: number;
    userAgent: string;
    screenResolution: string;
    language: string;
    referrer: string;
}

interface ApiRequest {
    endpoint: string;
    method: string;
    duration: number;
    status: number;
    timestamp: number;
}

interface CustomEvent {
    category: string;
    action: string;
    label?: string;
    value?: number;
    timestamp: number;
}

class Analytics {
    private static instance: Analytics;
    private errors: ErrorEvent[] = [];
    private metrics: PerformanceMetric[] = [];
    private apiRequests: ApiRequest[] = [];
    private customEvents: CustomEvent[] = [];
    private currentSession: UserSession | null = null;
    private readonly STORAGE_KEY = 'app_analytics';
    private readonly EVENT_BATCH_SIZE = 10;
    private readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

    private constructor() {
        this.setupErrorTracking();
        this.setupPerformanceTracking();
        this.setupSessionTracking();
        this.loadStoredData();
    }

    public static getInstance(): Analytics {
        if (!Analytics.instance) {
            Analytics.instance = new Analytics();
        }
        return Analytics.instance;
    }

    private setupErrorTracking(): void {
        window.onerror = (message, source, lineno, colno, error) => {
            this.trackError({ message: message.toString(), source, lineno, colno, error, timestamp: Date.now() });
        };

        window.addEventListener('unhandledrejection', (event) => {
            this.trackError({
                message: `Unhandled Promise Rejection: ${event.reason}`,
                timestamp: Date.now()
            });
        });
    }

    private setupPerformanceTracking(): void {
        if ('PerformanceObserver' in window) {
            // Track Core Web Vitals
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    this.trackPerformance({
                        name: entry.name,
                        value: entry.startTime,
                        rating: this.getRating(entry.name, entry.startTime),
                        timestamp: Date.now()
                    });
                });
            });

            observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'layout-shift', 'first-input'] });

            // Track Navigation Timing
            window.addEventListener('load', () => {
                const timing = performance.timing;
                const navigationStart = timing.navigationStart;

                this.trackPerformance({
                    name: 'page-load',
                    value: timing.loadEventEnd - navigationStart,
                    rating: this.getRating('page-load', timing.loadEventEnd - navigationStart),
                    timestamp: Date.now()
                });

                this.trackPerformance({
                    name: 'dom-interactive',
                    value: timing.domInteractive - navigationStart,
                    rating: this.getRating('dom-interactive', timing.domInteractive - navigationStart),
                    timestamp: Date.now()
                });
            });
        }
    }

    private setupSessionTracking(): void {
        this.startNewSession();

        // Update session on activity
        ['click', 'scroll', 'keypress'].forEach(eventType => {
            window.addEventListener(eventType, () => this.updateSession());
        });

        // Check session timeout periodically
        setInterval(() => this.checkSessionTimeout(), 60000);
    }

    private startNewSession(): void {
        this.currentSession = {
            sessionId: this.generateSessionId(),
            startTime: Date.now(),
            lastActive: Date.now(),
            userAgent: navigator.userAgent,
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            language: navigator.language,
            referrer: document.referrer
        };
    }

    private generateSessionId(): string {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    private updateSession(): void {
        if (this.currentSession) {
            this.currentSession.lastActive = Date.now();
        }
    }

    private checkSessionTimeout(): void {
        if (this.currentSession && 
            Date.now() - this.currentSession.lastActive > this.SESSION_TIMEOUT) {
            this.startNewSession();
        }
    }

    private getRating(metricName: string, value: number): 'good' | 'needs-improvement' | 'poor' {
        const thresholds = {
            'first-contentful-paint': { good: 1800, poor: 3000 },
            'largest-contentful-paint': { good: 2500, poor: 4000 },
            'first-input-delay': { good: 100, poor: 300 },
            'cumulative-layout-shift': { good: 0.1, poor: 0.25 },
            'page-load': { good: 3000, poor: 6000 },
            'dom-interactive': { good: 2000, poor: 4000 }
        };

        const metric = metricName.toLowerCase();
        const threshold = thresholds[metric as keyof typeof thresholds];

        if (!threshold) return 'good';

        if (value <= threshold.good) return 'good';
        if (value <= threshold.poor) return 'needs-improvement';
        return 'poor';
    }

    public trackError(error: ErrorEvent): void {
        this.errors.push(error);
        this.persistData();
        console.error('Tracked error:', error);
    }

    public trackPerformance(metric: PerformanceMetric): void {
        this.metrics.push(metric);
        this.persistData();
        console.log('Performance metric:', metric);
    }

    public trackApiRequest(request: ApiRequest): void {
        this.apiRequests.push(request);
        this.persistData();
        console.log('API request tracked:', request);
    }

    public trackEvent(category: string, action: string, label?: string, value?: number): void {
        const event: CustomEvent = {
            category,
            action,
            label,
            value,
            timestamp: Date.now()
        };
        
        this.customEvents.push(event);
        console.log('Event tracked:', event);

        if (this.customEvents.length >= this.EVENT_BATCH_SIZE) {
            this.sendEventBatch();
        }
    }

    private async sendEventBatch(): Promise<void> {
        const events = this.customEvents.splice(0, this.EVENT_BATCH_SIZE);
        try {
            // Here you would typically send the events to your analytics backend
            // For now, we'll just log them
            console.log('Sending event batch:', events);
        } catch (error) {
            console.error('Failed to send event batch:', error);
            // Requeue failed events
            this.customEvents.unshift(...events);
        }
    }

    private persistData(): void {
        const data = {
            errors: this.errors,
            metrics: this.metrics,
            apiRequests: this.apiRequests,
            customEvents: this.customEvents,
            session: this.currentSession
        };

        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
        } catch (error) {
            console.error('Failed to persist analytics data:', error);
        }
    }

    private loadStoredData(): void {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored) {
                const data = JSON.parse(stored);
                this.errors = data.errors || [];
                this.metrics = data.metrics || [];
                this.apiRequests = data.apiRequests || [];
                this.customEvents = data.customEvents || [];
            }
        } catch (error) {
            console.error('Failed to load stored analytics data:', error);
        }
    }

    public getMetrics(): PerformanceMetric[] {
        return this.metrics;
    }

    public getErrors(): ErrorEvent[] {
        return this.errors;
    }

    public getApiRequests(): ApiRequest[] {
        return this.apiRequests;
    }

    public getCustomEvents(): CustomEvent[] {
        return this.customEvents;
    }

    public getCurrentSession(): UserSession | null {
        return this.currentSession;
    }

    public clearMetrics(): void {
        this.metrics = [];
        this.persistData();
    }

    public clearErrors(): void {
        this.errors = [];
        this.persistData();
    }

    public clearAll(): void {
        this.errors = [];
        this.metrics = [];
        this.apiRequests = [];
        this.customEvents = [];
        localStorage.removeItem(this.STORAGE_KEY);
    }

    public generateReport(): {
        performance: { good: number, needsImprovement: number, poor: number },
        errors: { count: number, lastError?: ErrorEvent },
        apiHealth: { success: number, failed: number, averageResponseTime: number },
        sessionInfo: UserSession | null
    } {
        const performance = {
            good: this.metrics.filter(m => m.rating === 'good').length,
            needsImprovement: this.metrics.filter(m => m.rating === 'needs-improvement').length,
            poor: this.metrics.filter(m => m.rating === 'poor').length
        };

        const apiStats = {
            success: this.apiRequests.filter(r => r.status < 400).length,
            failed: this.apiRequests.filter(r => r.status >= 400).length,
            averageResponseTime: this.apiRequests.reduce((acc, curr) => acc + curr.duration, 0) / 
                               (this.apiRequests.length || 1)
        };

        return {
            performance,
            errors: {
                count: this.errors.length,
                lastError: this.errors[this.errors.length - 1]
            },
            apiHealth: apiStats,
            sessionInfo: this.currentSession
        };
    }
}

export const analytics = Analytics.getInstance(); 