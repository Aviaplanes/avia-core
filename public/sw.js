// public/sw.js
const CACHE_NAME = 'video-cache-v1';

const VIDEO_URLS = [
  '/footage/Comp 1_11.mp4',
  '/footage/eraserhead.mp4',
  '/footage/gat.mp4',
  '/footage/ggg.mp4',
  '/footage/IVOXYGEN - the girl next door.webm',
  '/footage/Jordan Barrett DANCE - SMOKE IT OFF - SLOWED.mp4',
  '/footage/lauren.mp4',
  '/footage/pip.mp4',
  '/footage/rjaviy.mp4',
  '/footage/soundss.mp4',
  '/footage/urban.mp4',
];

// Установка — кешируем все видео
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching videos...');
      return cache.addAll(VIDEO_URLS);
    })
  );
  self.skipWaiting();
});

// Активация — удаляем старый кеш
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch — сначала кеш, потом сеть
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Только для видео
  if (url.pathname.startsWith('/footage/')) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) {
          console.log('From cache:', url.pathname);
          return cached;
        }
        
        return fetch(event.request).then((response) => {
          // Кешируем новое видео
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });
          return response;
        });
      })
    );
  }
});