//Here is where the indexedDB stuff starts.
//Inspired by this demo: https://hacks.mozilla.org/2012/02/storing-images-and-files-in-indexeddb/
///and this tutorial: https://medium.com/@AndyHaskell2013/build-a-basic-web-app-with-indexeddb-8ab4f83f8bda

let db;

//Currently not actually using this function below...?
function initializeDB() {
    if (!('indexedDB' in window)) {
        console.log('This browser doesn\'t support IndexedDB');
        return;
    }
};

let dbReq = indexedDB.open('trackerdb', 1);

dbReq.onupgradeneeded = function (event) {
    // Set the db variable to our database so we can use it!  
    db = event.target.result;
    // Create an object store named notes. Object stores
    // in databases are where data are stored.
    let trackers = db.createObjectStore('trackers', {
        autoIncrement: true
    });
}

dbReq.onsuccess = function (event) {
    db = event.target.result;
    // addTrackerData(db, "hi!!!");
    console.log("hello!!");
}
dbReq.onerror = function (event) {
    alert('error opening database ' + event.target.errorCode);
}

function addTrackerData(db, m) {
    let tx = db.transaction(['trackers'], 'readwrite')
    let store = tx.objectStore('trackers');

    // Put the sticky note into the object store
    let tracker = {
        text: m,
        timestamp: Date.now()
    };
    store.add(tracker);

    // Wait for the database transaction to complete
    tx.oncomplete = function () {
        console.log('stored note!')
    }
    tx.onerror = function (event) {
        alert('error storing note ' + event.target.errorCode);
    }

}