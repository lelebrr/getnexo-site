importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
        cacheName: 'static-assets'
    })
);

const CACHE_NAME = 'jetnexo-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/assets/vendor.css',
    '/assets/critical.css',
    '/fonts/inter.woff2'
];

// Offline-First Logic
self.addEventListener('install', (e) => {
    e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener('fetch', (e) => {
    // Cache Strategies
    // 1. API: Network First, Fallback to Cache (Stale-While-Revalidate logic)
    if (e.request.url.includes('/api/')) {
        e.respondWith(
            fetch(e.request).then(res => {
                const clone = res.clone();
                caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
                return res;
            }).catch(() => caches.match(e.request))
        );
        return;
    }

    // 2. Static: Cache First
    e.respondWith(
        caches.match(e.request).then((res) => res || fetch(e.request))
    );
});
