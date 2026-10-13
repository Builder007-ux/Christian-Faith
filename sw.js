// Service Worker: lädt die App-Hülle offline. Inhalte (content.json) werden zuerst vom Netz geholt.
const CACHE = 'cf-v1';
const SHELL = [
  './',
  'index.html',
  'css/style.css',
  'js/i18n.js',
  'js/app.js',
  'manifest.webmanifest',
  'icon.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  // Inhalte immer zuerst aus dem Netz, Cache nur als Ausweichlösung.
  if (req.url.includes('content.json')) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // App-Hülle: Cache zuerst, sonst Netz.
  event.respondWith(
    caches.match(req).then((hit) => hit || fetch(req).then((res) => {
      if (res.ok && new URL(req.url).origin === self.location.origin) {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
      }
      return res;
    }).catch(() => caches.match('index.html')))
  );
});
