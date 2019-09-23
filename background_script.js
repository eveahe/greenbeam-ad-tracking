// Put all the javascript code here, that you want to execute in background.
let disconnectData;

// function logURL(requestDetails) {
//     if (requestDetails.url !== 'https://raw.githubusercontent.com/disconnectme/disconnect-tracking-protection/master/entities.json') {
//         console.log("Test Test logUrl: " + requestDetails.url)
//     }
// }

// browser.webRequest.onBeforeRequest.addListener(
//     logURL, {
//         urls: ["<all_urls>"]
//     }
// );

var parseJson = function (response) {
    return response.json()
};

fetch('https://raw.githubusercontent.com/disconnectme/disconnect-tracking-protection/master/services.json')
    .then(parseJson)
    .then(data => {
        var categoryName = Object.keys(data)[1]
        console.log(data[categoryName])
    })

function loadDisconnectJson() {
    var parseJson = function (response) {
        return response.json()
    };

    fetch('https://raw.githubusercontent.com/disconnectme/disconnect-tracking-protection/master/entities.json')
        .then(parseJson)
        .then(data => {
            disconnectData = data;
        })
}

loadDisconnectJson()

////the below function is from:
//https://stackoverflow.com/questions/8498592/extract-hostname-name-from-string
function extractHostName(url) {
    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname

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

function checkUrlIsTracker(requestDetails) {
    var urlHostName = extractHostName(requestDetails.url)

    if (requestDetails.url !== 'https://raw.githubusercontent.com/disconnectme/disconnect-tracking-protection/master/entities.json') {

        var parseJson = function (response) {
            return response.json()
        };

        fetch('https://raw.githubusercontent.com/disconnectme/disconnect-tracking-protection/master/entities.json')
            .then(parseJson)
            .then(data => {
                var jsonLength = Object.keys(data).length;
                for (var i = 0; i < jsonLength; i++) {
                    var trackerName = Object.keys(data)[i];
                    var trackerUrlArray = data[trackerName].resources;
                    if (trackerUrlArray.includes(urlHostName)) {
                        console.log("hostname: " + urlHostName)
                    }
                    // console.log(trackerUrlArray.includes(urlHostName))
                }
            })

    }
    // var jsonLength = Object.keys(disconnectData).length;
    // for (var i = 0; i < jsonLength; i++) {
    //     var trackerName = Object.keys(disconnectData)[i]
    //     var trackerUrlArray = disconnectData[trackerName].resources
    //     console.log(trackerUrlArray)
    //     console.log(trackerUrlArray.includes(requestDetails.url))

}



browser.webRequest.onBeforeRequest.addListener(
    checkUrlIsTracker, {
        urls: ["<all_urls>"]
    }
);