const CACHE_NAME = 'static-cache-v1';

const FILES_TO_CACHE = [
    'offline.html'
];

// install-event wird bei der register()-Methode aufgerufen
self.addEventListener('install', evt => {
    console.log('service-worker: Install sw');
    evt.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('SWM: pre-caching offlingpage');
                return cache.addAll(FILES_TO_CACHE);
            })
    );
    //gleich aktivieren
    self.skipWaiting();
});

//#region offline
self.addEventListener('fetch', evt => {
    console.log('service-worker: Fetch event', evt.request.url);
    if (evt.request.mode !== 'navigate') {
        return;
    }

    //Offline: eigene Datei statt 404
    evt.respondWith(
        fetch(evt.request)
            .catch(() => {
                return caches.open(CACHE_NAME)
                    .then(cache => {
                        return cache.match('offline.html')
                    })
            }));
});
//#endregion