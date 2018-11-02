const iframeEl = document.getElementById('builder');
const $ = window.jQuery;
function sendMessage(msg) {
    iframeEl.contentWindow.postMessage(msg, '*');
}

function initMessageListener() {
    let lastMsg = null;
    $(window).on('message', function (e) {
        const newMsg = e.originalEvent.data;
        if (newMsg != lastMsg) {

        }
        console.log('Got changes from iframe page');
    });
}

module.exports = {
    sendMessage,
    initMessageListener
 };