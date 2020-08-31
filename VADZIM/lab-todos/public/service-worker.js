const CACHE_NAME = 'static-cache-v1';
const FILES_TO_CACHE = [
    'offline.html'
];

// install-event wird bei der register()-Methode aufgerufen
self.addEventListener('install', evt => {
    console.log('ServiceWorker: Install sw');
    evt.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('ServiceWorker: Pre-caching offline page');
                return cache.addAll(FILES_TO_CACHE);
            })
    );
    // gleich aktivieren
    self.skipWaiting();
});

self.addEventListener('fetch', evt => {
    // Fetch-Event abfangen
    console.log('ServiceWorker: Fetch event', evt.request.url);
    if (evt.request.mode !== 'navigate') {
        // keine Seiten-Navigation
        return;
    }
    //#region Offline Szenario: Eigene Datei anstatt vom 404-Dino    
    evt.respondWith(
        fetch(evt.request)
        .catch(() => {
            return caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.match('offline.html')
            })
        })        
    )
    //#endregion    
});
