const CACHE_NAME = 'prime-core-v3';

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll([
                './',
                './index.html',
                './Small.wav',
                './Big.wav'
            ]);
        })
    );
    self.skipWaiting(); 
});

self.addEventListener('activate', (event) => {
    event.waitUntil(caches.keys().then((keys) => Promise.all(
        keys.map(key => {
            if (key !== CACHE_NAME && key !== 'prime-games-data') return caches.delete(key);
        })
    )));
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                const resClone = response.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
                return response;
            })
            .catch(() => {
                return caches.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) return cachedResponse;
                    
                    // Only fallback to root index.html if the main hub is specifically requested.
                    // This stops the Prime Games UI from loading inside game iframes when offline!
                    if (event.request.mode === 'navigate' && event.request.url.endsWith('primegames/')) {
                        return caches.match('./index.html');
                    }
                });
            })
    );
});
