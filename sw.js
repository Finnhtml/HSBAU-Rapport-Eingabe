const CACHE_NAME = 'hs-rapport-v9'; // Ich habe auf v9 erhöht, wegen besserem Bemerkungstextfeld.
const ASSETS = [
  'index.html',
  'download-center.html',
  'installation-anleitung.txt',
  'HSBAU Rapport Vorlage.xlsx',
  'icon.png',
  'exceljs.min.js',
  'signature_pad.umd.min.js',
  'xlsx-populate.min.js',
  'manifest.json',
  'icon.svg'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then((res) => res || fetch(e.request)));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
});