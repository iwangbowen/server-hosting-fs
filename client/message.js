const fs = require('./fs');
const util = require('./util');
const { getWorkspace, setWorkspaceInBuilder } = require('./workspace');

const iframeEl = document.getElementById('iframe');
const $ = window.jQuery;

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

function isIgnoreMessage() {
    return getWorkspace() !== 'builder';
}

function sendMessage(msg) {
    iframeEl.contentWindow.postMessage(msg, '*');
}

function initMessageListener() {
    $(window).on('message', ({ originalEvent: { data: newMsg } }) => {
        const { type, html, js, relativePath, path } = newMsg;
        if (type === EDIT) {
            if (!isIgnoreMessage()) {
                // When users open html pages in builder,
                // we directly save new html content to fs
                // without having to do anything with editor
                if (builder.activePageRelativePath === relativePath) {
                    if (builder.pages[relativePath].html !== html) {
                        fs.writeFileInBuilder(relativePath, html, (err, payload) => {
                            if (err) {
                                return util.handleError(err);
                            }
                            builder.pages[relativePath].stat = payload.stat;
                        });
                        builder.pages[relativePath].html = html;
                    }
                }
            }
        } else if (type === ADD) {
            fs.writeFile(relativePath, html);
        } else if (type === UPDATE_SHARED_JS) {
            // User may choose to update shared js file without opening it in editor,
            // we cannot save to current active editor
            // So we directly update file in fs
            fs.writeFile(relativePath, js);
        }
    });
}

const builder = {
    activePageRelativePath: '',
    pages: {}
};

let isIframeLoaded = false;
let pendingMessages = [];

function setIframeLoaded() {
    isIframeLoaded = true;
}

function sendPendingMessages() {
    pendingMessages.forEach(sendMessage);
}

function initBuilder(message, relativePath) {
    if (isIframeLoaded) {
        sendMessage(message);
    } else {
        pendingMessages.push(message);
    }
    builder.activePageRelativePath = relativePath;
    builder.pages[relativePath] || (builder.pages[relativePath] = {});
    setWorkspaceInBuilder();
}

module.exports = {
    sendMessage,
    initMessageListener,
    Message,
    isIgnoreMessage,
    ADD,
    EDIT,
    UPDATE_SHARED_JS,
    builder,
    initBuilder,
    setIframeLoaded,
    sendPendingMessages
};