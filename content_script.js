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
    document.getElementById('numTrackers').textContent = numTrackers;
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