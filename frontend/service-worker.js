const CACHE_NAME = 'quickclinic-v1';
const urlsToCache = [
  '/frontend/',
  '/frontend/index.html',
  '/frontend/login.html',
  '/frontend/register.html',
  '/frontend/dashboard.html',
  '/frontend/chat.html',
  '/frontend/chat-doctor.html',
  '/frontend/book.html',
  '/frontend/record.html',
  '/frontend/record-doctor.html',
  '/frontend/assets/style.css',
  '/frontend/assets/darkmode.js',
  '/frontend/assets/icons/icon-192.png',
  '/frontend/assets/icons/icon-512.png',
  '/frontend/manifest.json',
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
      .then(response => response || fetch(event.request))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    )
  );
});

