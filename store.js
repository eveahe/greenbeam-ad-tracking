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

let dbReq = indexedDB.open('trackerdb', 2);

dbReq.onupgradeneeded = function (event) {
    // Set the db variable to our database so we can use it!  
    db = event.target.result;
    // Create an object store named notes. Object stores
    // in databases are where data are stored.
    let trackers;
    if (!db.objectStoreNames.contains('trackers')) {
        trackers = db.createObjectStore('trackers', {
            autoIncrement: true
        });
    } else {
        trackers = dbReq.transaction.objectStore('trackers')
    }
    if (!trackers.indexNames.contains('timestamp')) {
        trackers.createIndex('timestamp', 'timestamp');
    }
}


dbReq.onsuccess = function (event) {
    db = event.target.result;
}
dbReq.onerror = function (event) {
    alert('error opening database ' + event.target.errorCode);
}

function addTrackerData(db, t, ts, s) {
    let tx = db.transaction(['trackers'], 'readwrite')
    let store = tx.objectStore('trackers');

    // Put the sticky note into the object store
    let tracker = {
        trackername: t,
        trackersource: ts,
        size: s,
        timestamp: Date.now()
    };
    store.add(tracker);

    // Wait for the database transaction to complete
    tx.oncomplete = function () {
        console.log('stored tracker!')
    }
    tx.onerror = function (event) {
        alert('error storing tracker ' + event.target.errorCode);
    }

}



function getAndDisplayTrackers() {
    let tx = db.transaction(['trackers'], 'readonly');
    let store = tx.objectStore('trackers'); // Create a cursor request to get all items in the store, which 
    // we collect in the allTrackers array
    let req = store.openCursor();
    let allTrackers = [];

    req.onsuccess = function (event) {
        // The result of req.onsuccess is an IDBCursor
        let cursor = event.target.result;
        if (cursor != null) { // If the cursor isn't null, we got an IndexedDB item.
            // Add it to the note array and have the cursor continue!
            allTrackers.push(cursor.value);
            cursor.continue();
        } else { // If we have a null cursor, it means we've gotten
            // all the items in the store, so display the notes we got
            // displayTracker(allTrackers);
            console.log(allTrackers)
        }
    }
    req.onerror = function (event) {
        alert('error in cursor request ' + event.target.errorCode);
    }
}

// setInterval(getAndDisplayTrackers, 10000)