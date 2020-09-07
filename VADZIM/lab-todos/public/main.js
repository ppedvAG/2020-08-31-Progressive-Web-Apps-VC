const todosApp = {
    selectedTodos: {}
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            // returns: Promise<ServiceWorkerRegistration>
            .then(reg => {
                console.log('Service worker registered.', reg);
            });
    });
}

//#region Offline Szenario: Eigene Datei anstatt vom 404-Dino
// bei offline werden die Daten nicht geholt, 
// sondern durch start_url in manifest und 
// durch static_cache wird offline.html gezeigt
/* fetch('https://jsonplaceholder.typicode.com/todos')
.then(response => response.json())
// .then(json => console.log(json))
.then(json => giveTable(json)) */
//#endregion

function giveTable(arr) {
    tableId.innerHTML = `
    <thead>
            <tr>
                <th>id</th>
                <th>userId</th>
                <th>title</th>
                <th>completed</th>
            </tr>
        </thead>
        <tbody id="tbodyId"></tbody>
        <tfoot>
            <tr>
                <th>id</th>
                <th>userId</th>
                <th>title</th>
                <th>completed</th>
            </tr>
        </tfoot>
    `;
    for (const item of arr) {
        let newRow = tbodyId.insertRow();
        newRow.insertCell().innerText = item.id;
        newRow.insertCell().innerText = item.userId;
        newRow.insertCell().innerText = item.title;
        newRow.insertCell().innerText = item.completed;
    }

}

function getTodosFromNetwork(urlTeil) {
    return fetch(`https://jsonplaceholder.typicode.com/${urlTeil}`)
        .then(response => {
            return response.json()
        })
        // .then(json => console.log(json))
        // .then(json => giveTable(json))
        .catch((err) => console.log('err', err));
}

function getTodosFromCache(urlTeil) {
    if (!("caches" in window)) {
        console.log('bin im if -keine caches in window-');
        return null;
    }
    console.log('window.caches.keys(): ', window.caches.keys());
    /* 
[[PromiseValue]]: Array(3)
0: "static-cache-v1"
1: "static-cache-v2"
2: "data-cache-v1"
length: 3 
*/
console.log('window.caches.has(): ', window.caches.has('data-cache-v1'));
console.log('window.caches.match(): ', window.caches.match('https://jsonplaceholder.typicode.com/s'));
/* 
[[PromiseStatus]]: "fulfilled"
[[PromiseValue]]: Response
body: ReadableStream
bodyUsed: false
headers: Headers {}
ok: true
redirected: false
status: 200
statusText: ""
type: "cors"
url: "https://jsonplaceholder.typicode.com/todos"
*/
console.log('window.caches.open(): ', window.caches.open('data-cache-v1'));

    const url = `https://jsonplaceholder.typicode.com/${urlTeil}`;
    return caches.match(url)
    .then(response => {
        if (response) {
            return response.json();
        }
        return null;
    })
    .catch(err => {
        console.log('Fehler beim Holen von Data vom Cache', err);
        return null;
    })
    
}

function updateData() {
    getTodosFromCache('todos')
    .then((response) => {
        giveTable(response);
    })
    .catch(() => 
    null);
    getTodosFromNetwork('todos')
    .then((response) => {
        giveTable(response);
    })
}

function init() {
    console.log('window.caches :>> ', window.caches);
    updateData();
}

init();
