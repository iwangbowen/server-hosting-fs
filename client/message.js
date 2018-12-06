const fs = require('./fs');
const builder = require('./builder');

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
        const { type, html, js, relativePath } = newMsg;
        if (type === ADD || type === EDIT) {
            if (!isIgnoreMessage()) {
                // When users open html pages in builder,
                // we directly save new html content to fs
                // without having to do anything with editor
                if (builder.activePageRelativePath === relativePath) {
                    if (builder.pages[relativePath] !== html) {
                        fs.writeFile(relativePath, html);
                        builder.pages[relativePath] = html;
                    }
                }
            }
        } else if (type === UPDATE_SHARED_JS) {
            // User may choose to update shared js file without opening it in editor,
            // we cannot save to current active editor
            // So we directly update file in fs
            fs.writeFile(path, js);
        }
    });
}

const ADD = 'add';
const EDIT = 'edit';
const UPDATE_SHARED_JS = 'updateSharedJS';
class Message {
    constructor({ type, template, html, path, js, relativePath }) {
        this.type = type;
        this.template = template;
        this.html = html;
        this.path = path;
        this.js = js;
        this.relativePath = relativePath;
    }
};

module.exports = {
    sendMessage,
    initMessageListener,
    Message,
    setIgnoreMessage,
    isIgnoreMessage,
    ADD,
    EDIT,
    UPDATE_SHARED_JS
};