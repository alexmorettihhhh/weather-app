import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute, NavigationRoute, setDefaultHandler } from 'workbox-routing';
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { BackgroundSyncPlugin } from 'workbox-background-sync';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { clientsClaim } from 'workbox-core';

// Immediately claim any open clients
clientsClaim();

// Cache name constants
const CACHE_NAMES = {
  static: 'static-resources-v1',
  api: 'api-cache-v1',
  images: 'images-cache-v1',
  offline: 'offline-cache-v1'
};

// Static resources to precache
const STATIC_RESOURCES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png',
  '/offline.html',
  '/static/css/main.chunk.css',
  '/static/js/main.chunk.js',
  '/static/js/bundle.js'
];

// Precache static resources
precacheAndRoute(self.__WB_MANIFEST);

// Background sync for failed API requests
const backgroundSyncPlugin = new BackgroundSyncPlugin('weather-sync-queue', {
  maxRetentionTime: 24 * 60 // Retry for up to 24 hours
});

// Cache static resources
registerRoute(
  ({ request }) => request.destination === 'style' ||
                  request.destination === 'script' ||
                  request.destination === 'font',
  new StaleWhileRevalidate({
    cacheName: CACHE_NAMES.static,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
      })
    ]
  })
);

// Cache API responses with network-first strategy
registerRoute(
  ({ url }) => url.origin === 'https://api.weatherapi.com',
  new NetworkFirst({
    cacheName: CACHE_NAMES.api,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 60 * 60 // 1 hour
      }),
      backgroundSyncPlugin
    ],
    networkTimeoutSeconds: 3
  })
);

// Cache images with cache-first strategy
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: CACHE_NAMES.images,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
      })
    ]
  })
);

// Offline fallback
const offlineFallback = new NavigationRoute(
  async () => {
    const cache = await caches.open(CACHE_NAMES.offline);
    return cache.match('/offline.html') || Response.error();
  },
  {
    blacklist: [/^\/_/, /\/[^/?]+\.[^/]+$/]
  }
);

registerRoute(offlineFallback);

// Periodic background sync
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'weather-sync') {
    event.waitUntil(updateWeatherData());
  }
});

async function updateWeatherData() {
  const cache = await caches.open(CACHE_NAMES.api);
  const requests = await cache.keys();
  
  for (const request of requests) {
    try {
      const response = await fetch(request);
      if (response.ok) {
        await cache.put(request, response);
      }
    } catch (error) {
      console.error('Background sync failed:', error);
    }
  }
}

// Clean up old caches
cleanupOutdatedCaches();

// Handle installation
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAMES.static).then(cache => cache.addAll(STATIC_RESOURCES)),
      caches.open(CACHE_NAMES.offline).then(cache => cache.add('/offline.html'))
    ])
  );
});

// Message handling for updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
}); 