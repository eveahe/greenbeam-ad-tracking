// Put all the javascript code here, that you want to execute in background.
let disconnectData;
let firstRun = true;

async function checkFirstRun() {
    if (firstRun === true) {
        loadDisconnectJson()
    }
}

checkFirstRun()

// function logURL(requestDetails) {
//     if (requestDetails.url !== 'https://raw.githubusercontent.com/disconnectme/disconnect-tracking-protection/master/entities.json') {
//         console.log("Test Test logUrl: " + requestDetails.url)

//     }
// }


// browser.webRequest.onHeadersReceived.addListener(
//     logURL, {
//         urls: ["<all_urls>"]
//     },
//     ["blocking", "responseHeaders"]

// );


function loadDisconnectJson() {
    var parseJson = function (response) {
        return response.json()
    };

    fetch('https://raw.githubusercontent.com/disconnectme/disconnect-tracking-protection/master/entities.json')
        .then(parseJson)
        .then(data => {
            disconnectData = data;
            return disconnectData;
        })
}


////the below function is from:
//https://stackoverflow.com/questions/8498592/extract-hostname-name-from-string
function extractHostName(url) {
    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname

    //remove the http://
    if (url.indexOf("//") > -1) {
        hostname = url.split('/')[2];
    } else {
        hostname = url.split('/')[0];
    }
    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];

    return hostname;
}

//If the "tracker" is the same as the site we're visiting, we shouldn't log.
function matchingOrigin(a, o) {
    if (a.includes(o)) {
        return true;
    } else if (o === undefined) {
        console.log(Err)
    } else {
        return false;
    }
}

function checkUrlIsTracker(requestDetails) {
    var urlHostName = extractHostName(requestDetails.url);
    //giving our disconnect data list some time to load. 
    if (disconnectData !== undefined) {
        var jsonLength = Object.keys(disconnectData).length;
        for (var i = 0; i < jsonLength; i++) {
            var trackerName = Object.keys(disconnectData)[i];
            var trackerUrlArray = disconnectData[trackerName].resources;
            //We're checking to see whether the hostname is contained within any of the resource arrays.
            if (trackerUrlArray.some(function (v) {
                    return urlHostName.indexOf(v) >=
                        0;
                })) {
                if (!matchingOrigin(urlHostName, extractHostName(requestDetails.originUrl))) {
                    console.log(`It seems that there is a match for ${urlHostName} in the sites run by the tracker ${trackerName}`);
                    let filter = browser.webRequest.filterResponseData(requestDetails.requestId);
                    // console.log("filter test " + filter.ondata);
                    addTrackerData(db, trackerName, urlHostName, extractHostName(requestDetails.originUrl), 0.005);
                    let size;
                    // filter.ondata = event => {
                    //     size = event.data.byteLength;
                    //     console.log(trackerName);

                    // }

                }
            }
        }
    }
}




browser.webRequest.onHeadersReceived.addListener(
    checkUrlIsTracker, {
        urls: ["<all_urls>"]
    }, ["blocking", "responseHeaders"]
);