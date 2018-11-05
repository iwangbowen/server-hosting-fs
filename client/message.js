const editor = require('./editor');
const noide = require('./noide');

const iframeEl = document.getElementById('iframe');
const $ = window.jQuery;

function sendMessage(msg) {
    iframeEl.contentWindow.postMessage(msg, '*');
}

function initMessageListener() {
    let lastMsg = null;
    $(window).on('message', ({ originalEvent: { data: newMsg } }) => {
        if (newMsg != lastMsg) {
            const file = noide.current;
            const session = noide.getSession(file)
            session.setValue(newMsg);
            editor.execCommand('save');
        }
        lastMsg = newMsg;
    });
}

class Message {
    constructor(type, template, html) {
        this.type = type;
        this.template = template;
        this.html = html;
    }
};

module.exports = {
    sendMessage,
    initMessageListener,
    Message
};