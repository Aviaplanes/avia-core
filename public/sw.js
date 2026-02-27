// public/sw.js
const CACHE_NAME = 'media-cache-v2'; // ← обновил версию

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

const MUSIC_URLS = [
  '/music/Skit - JEEMBO.flac',
  '/music/Go Hella - JEEMBO.flac',
  '/music/Obsidian Bones - JEEMBO.flac',
  '/music/гиблое эго.flac',
  '/music/VELIAL SQUAD - GRAVELAND.flac',
  '/music/VELIAL SQUAD - CREEPERS.mpeg',
  '/music/IVOXYGEN - what else can you ask for.flac',
  '/music/Imogen Heap - Headlock.flac',
  '/music/VELIAL SQUAD - Вампирский щит.mp3',
  '/music/Черная_Река_ft_Trantor_p_shawtyglock.mp3',
  '/music/ATRA PLAGUE [p. shawtyglock x Yung Meep]   VELIAL SQUAD.mp3',
];

const COVER_URLS = [
  '/music/images/jeembo.jpg',
  '/music/images/гиблое эго.png',
  '/music/images/VELIAL SQUAD - GRAVELAND.webp',
  '/music/images/VELIAL SQUAD - CREEPERS.jpg',
  '/music/images/IVOXYGEN - what else can you ask for.jpg',
  '/music/images/Imogen Heap - Headlock.jpg',
  '/music/images/vampire.jpg',
  '/music/images/reka.png',
  '/music/images/d3ff548ecce04776e30c95a93cc342a9.webp',
];

const ALL_MEDIA = [...VIDEO_URLS, ...MUSIC_URLS, ...COVER_URLS];

// Установка — кешируем всё
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching media...');
      return cache.addAll(ALL_MEDIA);
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
  
  // Для видео и музыки
  if (url.pathname.startsWith('/footage/') || url.pathname.startsWith('/music/')) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) {
          console.log('From cache:', url.pathname);
          return cached;
        }
        
        return fetch(event.request).then((response) => {
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