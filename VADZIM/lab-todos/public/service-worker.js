const STATIC_CACHE_NAME = 'static-cache-v2';
const DATA_CACHE_NAME = 'data-cache-v1';

const FILES_TO_CACHE = [
    'offline.html'
];

// install-event wird bei der register()-Methode aufgerufen
self.addEventListener('install', evt => {
    console.log('ServiceWorker: Install sw');
    evt.waitUntil(
        caches.open(STATIC_CACHE_NAME)
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
    console.log('ServiceWorker: Fetch event, event.request: ', evt.request);     
    //#region Offline Szenario: Eigene Datei anstatt vom 404-Dino
    // nur die Requests von Seiten-Navigation (HTML-requests)
    // alle anderen requests für Scripte (script:src), CSS (link:css), Bilder (img:src) usw. gehen an Network    
/*     if (evt.request.mode !== 'navigate') {       
        return;
    } */
    // Current page responds with a 200 when offline  
/*     evt.respondWith(
        fetch(evt.request)
        .catch(() => {
            return caches.open(STATIC_CACHE_NAME)
            .then((cache) => {
                return cache.match('offline.html')
            })
        })        
    ) */
    //#endregion
    //#region stale while revalidate 
    // (erst gecachte Inhalte und parallel die gleichen Inhalte vom Server holen lassen)
        if (evt.request.url.includes('/todos')) {
            console.log('ServiceWorker: Fetch (data)', evt.request.url);
            // taucht in fetch-handler keine respondWith()-Methode auf,
            // tritt der SW nicht als Proxy auf
            evt.respondWith(
                caches.open(DATA_CACHE_NAME)
                .then((cache) => {
                    return fetch(evt.request)
                    // warum reagiert unser Handler nicht auf dieses Fetch und warum hier keine Schleife entsteht
                    // weil der SW nur dann als Proxy reinspringt
                    .then((response) => {
                        // Wenn der Server neue Daten geschickt hat
                        // werden sie im Cache kopiert
                        if (response.status === 200) {
                            cache.put(evt.request.url, response.clone());
                        }
                        return response;
                    }).catch((err) => {
                        // Wenn es Probleme bei der Verbindung gab,
                        // dann hole die Daten vom Cache
                        return cache.match(evt.request);
                    });
                }));
                return;
        }
        // beinhaltet die Request-Url keine todos, 
        // dann im Static-Cache nachschauen
        evt.respondWith(
            caches.open(STATIC_CACHE_NAME).then((cache) => {
                return cache.match(evt.request)
                .then((response) => {
                    return response || fetch(evt.request);
                })
            })
        )
    //#endregion
});
