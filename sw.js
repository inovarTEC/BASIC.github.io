const CACHE = 'meu-app-v1';
const ARQUIVOS = [
  '/',
  '/index.html',
  '/Eletricista POWER 5.2_arquivos/todos os arquivos min.css',
  '/Eletricista POWER 5.2_arquivos/css2',
  '/Eletricista POWER 5.2_arquivos/html2pdf.bundle.min.js.download',
  '/Eletricista POWER 5.2_arquivos/recurso_salvo',
  '/Eletricista POWER 5.2_arquivos/986df696-a484-42dc-a3ed-0466520e31dc',
  '/Eletricista POWER 5.2_arquivos/c8d3a069-77c7-41b6-927e-06a4c17fac35',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ARQUIVOS))
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
