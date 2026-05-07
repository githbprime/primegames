// sw.js - Prime Games Service Worker
const CACHE_NAME = 'prime-core-v1';
const CORE_ASSETS = [
    './',
    './index.html',
    './Small.wav',
    './Big.wav'
];

// Install: Save the core site to the device
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(CORE_ASSETS);
        })
    );
    self.skipWaiting();
});

// Fetch: Intercept requests. If offline, serve from cache.
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
    );
});
