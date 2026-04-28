// Simple service worker for caching assets
const CACHE_NAME = 'noir-co-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/',
  'https://fonts.googleapis.com/',
  'https://fonts.gstatic.com/'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request).then(fetchResponse => {
          // Cache new resources dynamically
          if (event.request.url.includes('/assets/') || 
              event.request.url.includes('fonts') ||
              event.request.url.includes('images.unsplash')) {
            return caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, fetchResponse.clone());
              return fetchResponse;
            });
          }
          return fetchResponse;
        });
      })
      .catch(() => {
        // Fallback for offline - return cached index.html
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
