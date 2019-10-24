function publishTrackers() {
    const trackerDiv = document.createElement("div");
    trackerDiv.textContent = "Who is watching me and at what cost?";
    trackerDiv.className = "trackerDiv";
    document.body.appendChild(trackerDiv);
    const clickMe = document.createElement("button");
    clickMe.id = "clickMe"
    clickMe.textContent = "click me!!"
    trackerDiv.appendChild(clickMe);
    const numTrackers = document.createElement("div");
    numTrackers.id = 'numTrackers'
    trackerDiv.appendChild(numTrackers);
}

publishTrackers()

function handleResponse(message) {
    var numTrackers = message;
    var numTrackersDiv = document.getElementById('numTrackers');
    var clickMe = document.getElementById('clickMe');
    if (clickMe.textContent === "click me!!") {
        numTrackersDiv.textContent = numTrackers;
        clickMe.textContent = "eep."
    } else {
        numTrackersDiv.textContent = "";
        clickMe.textContent = "click me!!";
    }
}

function handleError(error) {
    console.log(`Error: ${error}`);
}

function sendDataMessage() {
    var sending = browser.runtime.sendMessage({
        greeting: 'sendtrackers!',
        url: document.location.href
    });
    sending.then(handleResponse, handleError);
}

document.getElementById('clickMe').addEventListener("click", sendDataMessage);