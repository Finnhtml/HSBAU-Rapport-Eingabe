// HSBAU Rapport-Manager - Service Worker
// Ermöglicht Offline-Nutzung nach erstem Laden

const CACHE_NAME = 'hsbau-rapport-v2';

// Dateien die gecacht werden sollen
const CACHE_FILES = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
  // Externe CDN-Ressourcen
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
  'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js',
];

// Installation: Kern-Dateien cachen
self.addEventListener('install', event => {
  console.log('[SW] Installiere...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Lokale Dateien müssen gecacht werden
      return cache.addAll(['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'])
        .then(() => console.log('[SW] Kern-Dateien gecacht'))
        .catch(e => console.warn('[SW] Cache-Fehler:', e));
    })
  );
  self.skipWaiting();
});

// Aktivierung: Alten Cache löschen
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
  console.log('[SW] Aktiv');
});

// Fetch: Cache-First für lokale Dateien, Network-First für API
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Rapport-Nummer Server: immer Netzwerk (mit Fallback)
  if (url.hostname.includes('render.com') || url.hostname.includes('onrender.com')) {
    event.respondWith(
      fetch(event.request).catch(() =>
        new Response(JSON.stringify({ error: 'offline' }), {
          headers: { 'Content-Type': 'application/json' }
        })
      )
    );
    return;
  }

  // Pyodide & andere CDN: Cache-First
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        // Erfolgreiche Antworten cachen
        if (response && response.status === 200 && response.type !== 'opaque') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => cached || new Response('Offline', { status: 503 }));
    })
  );
});
