// public/sw.js
const CACHE_NAME = "video-cache-v1";
const VIDEO_URLS = [
  "/videos/Jordan Barrett DANCE - SMOKE IT OFF - SLOWED.mp4",
  "/videos/rjaviy.mp4",
  "/videos/eraserhead.mp4",
  "/videos/urban.mp4",
  "/videos/pip.mp4",
  "/videos/IVOXYGEN - the girl next door.webm",
];

// Установка - кэшируем видео
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Caching videos...");
      return cache.addAll(VIDEO_URLS);
    }),
  );
  self.skipWaiting();
});

// Активация - чистим старый кэш
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name)),
      );
    }),
  );
  self.clients.claim();
});

// Fetch - отдаём из кэша или загружаем
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Проверяем только видео файлы
  if (url.pathname.startsWith("/videos/")) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          console.log("Serving from cache:", url.pathname);
          return cachedResponse;
        }

        return fetch(event.request).then((networkResponse) => {
          // Кэшируем новое видео
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return networkResponse;
        });
      }),
    );
  }
});
