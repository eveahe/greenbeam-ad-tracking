//Here is where the indexedDB stuff starts.
//Inspired by this demo: https://hacks.mozilla.org/2012/02/storing-images-and-files-in-indexeddb/
///and this tutorial: https://medium.com/@AndyHaskell2013/build-a-basic-web-app-with-indexeddb-8ab4f83f8bda

let db;

//These come from the 1ByteModel from TheShiftProject in their Carbonalyser extension.
const defaultCarbonIntensityFactorIngCO2PerKWh = 519;
const kWhPerByteDataCenter = 0.00000000072;
const kWhPerByteNetwork = 0.00000000152;

//Currently not actually using this function below...?
function initializeDB() {
    if (!('indexedDB' in window)) {
        console.log('This browser doesn\'t support IndexedDB');
        return;
    }
};

let dbReq = indexedDB.open('trackerdb', 3);

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
    if (!trackers.indexNames.contains('trackerorigin')) {
        trackers.createIndex('trackerorigin', 'trackerorigin');
    }
}


dbReq.onsuccess = function (event) {
    db = event.target.result;
}
dbReq.onerror = function (event) {
    alert('error opening database ' + event.target.errorCode);
}

function addTrackerData(db, t, tl, to, s) {
    let tx = db.transaction(['trackers'], 'readwrite')
    let store = tx.objectStore('trackers');

    // Put the trackers in the object store
    let tracker = {
        trackername: t,
        trackerlink: tl,
        trackerorigin: to,
        size: s,
        timestamp: Date.now()
    };
    store.add(tracker);

    tx.onerror = function (event) {
        alert('error storing tracker ' + event.target.errorCode);
    }

}

function getAndDisplayTrackers() {
    let tx = db.transaction(['trackers'], 'readonly');
    let store = tx.objectStore('trackers'); // Create a cursor request to get all items in the store, which 
    // we collect in the allTrackers array
    let allTrackers = [];
    let sizeSum = 0;
    let kWHt = 0;
    let gCO2 = 0;


    var index = store.index('trackerorigin');
    //Note that right now this is just filtering for origins matching the NYTimes.
    //Should soon be changed to just the current origin tab. 
    var singleKeyRange = IDBKeyRange.only('www.nytimes.com');
    let req = index.openCursor(singleKeyRange, 'prev')

    req.onsuccess = function (event) {
        // The result of req.onsuccess is an IDBCursor
        let cursor = event.target.result;
        if (cursor != null) {
            allTrackers.push(cursor.value);
            cursor.continue();
        } else {
            //Calcating the amount for this domain
            allTrackers.forEach(function (e) {
                sizeSum += e.size;
            })
            kWHt = (sizeSum * kWhPerByteDataCenter) + (sizeSum * kWhPerByteNetwork)
            gCO2 = (defaultCarbonIntensityFactorIngCO2PerKWh * kWHt)
            console.log(`The kWHt total is: ${kWHt} and the gCO2 total is ${gCO2}`)
        }
    }
    req.onerror = function (event) {
        alert('error in cursor request ' + event.target.errorCode);
    }
}


function handleMessage(request, sender, sendResponse) {
    // console.log("Message from the content script: " +
    //     request.greeting);
    getAndDisplayTrackers()
    sendResponse({
        response: `I can send you trackers!!`
    });
}


browser.runtime.onMessage.addListener(handleMessage);