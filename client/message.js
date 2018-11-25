const editor = require('./editor');
const noide = require('./noide');

const iframeEl = document.getElementById('iframe');
const $ = window.jQuery;
let ignoreMessage = true;

function isIgnoreMessage() {
    return ignoreMessage;
}

function setIgnoreMessage(ignore) {
    ignoreMessage = ignore;
}

function sendMessage(msg) {
    iframeEl.contentWindow.postMessage(msg, '*');
}

function initMessageListener() {
    $(window).on('message', ({ originalEvent: { data: newMsg } }) => {
        if (!isIgnoreMessage()) {
            const file = noide.current;
            const session = noide.getSession(file);
            if (session) {
<<<<<<< HEAD
                if (session.getValue() !== newMsg) {
                    session.setValue(newMsg, true);
                    editor.execCommand('save');
                }
=======
                session.setValue(newMsg);
                editor.execCommand('save');
>>>>>>> parent of 97ebea7... Save to file after change happened
            }
        }
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
    Message,
    setIgnoreMessage,
    isIgnoreMessage
};