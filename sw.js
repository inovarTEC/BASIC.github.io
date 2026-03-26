const CACHE = 'meu-app-v3';
const ARQUIVOS = [
  '/BASIC.github.io/',
  '/BASIC.github.io/index.html',
  '/BASIC.github.io/Eletricista POWER 5.2_arquivos/todos os arquivos min.css',
  '/BASIC.github.io/Eletricista POWER 5.2_arquivos/css2',
  '/BASIC.github.io/Eletricista POWER 5.2_arquivos/html2pdf.bundle.min.js.download',
  '/BASIC.github.io/Eletricista POWER 5.2_arquivos/recurso_salvo',
  '/BASIC.github.io/Eletricista POWER 5.2_arquivos/986df696-a484-42dc-a3ed-0466520e31dc',
  '/BASIC.github.io/Eletricista POWER 5.2_arquivos/c8d3a069-77c7-41b6-927e-06a4c17fac35',
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARQUIVOS)));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request)
      .then(cached => cached || fetch(e.request))
      .catch(() => caches.match('/BASIC.github.io/index.html'))
  );
});
