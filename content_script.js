// (function () {
function publishTrackers() {
    const helloTDiv = document.createElement("div");
    // helloTDiv.textContent = "test test!!"
    helloTDiv.className = 'helloTDiv';
    document.body.appendChild(helloTDiv);
    const testButton = document.createElement("button");
    testButton.textContent = "click me!!"
    helloTDiv.appendChild(testButton);

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