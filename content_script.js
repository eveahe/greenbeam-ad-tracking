function publishTrackers() {
    const trackerDiv = document.createElement("div");
    trackerDiv.textContent = "Who's watching me and at what cost?"
    trackerDiv.className = 'trackerDiv';
    document.body.appendChild(trackerDiv);
    const clickMe = document.createElement("button");
    clickMe.id = "clickMe"
    clickMe.textContent = "click me!!"
    trackerDiv.appendChild(clickMe);

}

publishTrackers()

function handleResponse(message) {
    console.log(`Message from the background script:  ${message.response}`);
}

function handleError(error) {
    console.log(`Error: ${error}`);
}

function sendDataMessage() {
    var sending = browser.runtime.sendMessage({
        greeting: 'sendtrackers!'
    });
    sending.then(handleResponse, handleError);
}

window.addEventListener("click", sendDataMessage);