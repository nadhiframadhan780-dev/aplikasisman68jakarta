// Service Worker SMAN 68 Jakarta
const CACHE_NAME = 'sman68-v3';
const urlsToCache = [
    '/',
    '/index.html',
    '/sman68.html',
    '/sman68.css',
    '/sman68.js',
    '/admin.html',
    '/admin.css',
    '/admin.js',
    '/setup-admin.html',
    '/setup-operator.html',
    '/login-siswa-sman-68-jakarta.html',
    '/daftar-siswa-sman-68.html',
    '/absensi-siswa-68.html',
    '/login-guru-sman-68-jakarta.html',
    '/operator-siswa-guru.html',
    '/operator-siswa-guru.css',
    '/operator-siswa-guru.js',
    '/countdown-SPMB-2026-2027.html',
    '/countdown-pendaftaran-murid-mutasi-sman-68-jakarta.html',
    '/pendaftaran-murid-mutasi.html',
    '/pendaftaran-murid-mutasi.css',
    '/pendaftaran-murid-mutasi.js',
    '/virsch-68.html',
    '/68-404.html',
    '/manifest.json'
];

// Install Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
            .then(() => self.skipWaiting())
    );
});

// Activate Service Worker
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch Strategy: Cache First, Network Fallback
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request).then(response => {
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseToCache);
                    });
                    return response;
                });
            })
    );
});
