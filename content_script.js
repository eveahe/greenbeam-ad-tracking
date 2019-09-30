function publishTrackers() {
    const trackerDiv = document.createElement("div");
    trackerDiv.textContent = "Who is watching me and at what cost?";
    trackerDiv.className = "trackerDiv";
    document.body.appendChild(trackerDiv);
    const clickMe = document.createElement("button");
    clickMe.id = "clickMe"
    clickMe.textContent = "click me!!"
    trackerDiv.appendChild(clickMe);
}

// if (!trackerDiv) {
publishTrackers()
// }

function handleResponse(message) {
    console.log(`Message from the background script: ${message}`);
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