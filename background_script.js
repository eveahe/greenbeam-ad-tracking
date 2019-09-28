// Put all the javascript code here, that you want to execute in background.
let disconnectData;
let firstRun = true;

async function checkFirstRun() {
    if (firstRun === true) {
        loadDisconnectJson()
    }
}

checkFirstRun()

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
        //This means that the "tracker site" is the site being visited.
        return true;
    } else {
        return false;
    }
}

function checkUrlIsTracker(requestDetails) {
    //We need to open up a filter on the http request stream in order to get bytelength 
    //All the other attributes exist in the response header.
    let filter = browser.webRequest.filterResponseData(requestDetails.requestId);
    filter.ondata = event => {
        var urlHostName = extractHostName(requestDetails.url);
        //Giving our disconnect data list some time to load. 
        if (disconnectData !== undefined) {
            var jsonLength = Object.keys(disconnectData).length;
            for (var i = 0; i < jsonLength; i++) {
                var trackerName = Object.keys(disconnectData)[i];
                var trackerUrlArray = disconnectData[trackerName].resources;
                let size;
                size = event.data.byteLength;
                //We're checking to see whether the hostname is contained within any of the resource arrays.
                if (trackerUrlArray.some(function (v) {
                        return urlHostName.indexOf(v) >=
                            0;
                    })) {
                    //We are checking to make sure the "tracker" is not the tab open
                    var originHost;
                    if (requestDetails.originUrl) {
                        originHost = extractHostName(requestDetails.originUrl)
                    }
                    if (!matchingOrigin(urlHostName, originHost)) {
                        console.log(`It seems that there is a match for ${urlHostName} in the sites run by the tracker ${trackerName}`);
                        addTrackerData(db, trackerName, urlHostName, extractHostName(requestDetails.originUrl), size);
                    }

                }
            }
        }
        filter.write(event.data);
    }
    filter.onstop = event => {
        filter.disconnect();
    }
}

browser.webRequest.onHeadersReceived.addListener(
    checkUrlIsTracker, {
        urls: ["<all_urls>"]
    }, ["blocking", "responseHeaders"]
);