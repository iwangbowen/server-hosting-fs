const fs = require('./fs');
const util = require('./util');
const noide = require('./noide');
const { getWorkspace, setWorkspaceInBuilder } = require('./workspace');

const iframeEl = document.getElementById('iframe');
const $ = window.jQuery;

const ADD = 'add';
const EDIT = 'edit';
const UPDATE_SHARED_JS = 'updateSharedJS';
const QUERY_TEMPLATE_PAGES = 'queryTemplatePages';
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

function isInBuilder() {
    return getWorkspace() === 'builder';
}

function sendMessage(msg) {
    iframeEl.contentWindow.postMessage(msg, '*');
}

let templatePages = [];

function getTemplatePages() {
    return templatePages;
}

function setTemplatePages(pages) {
    templatePages = pages;
}

function initMessageListener() {
    $(window).on('message', ({ originalEvent: { data: newMsg } }) => {
        const { type, html, js, relativePath, path, templatePages } = newMsg;
        if (type === QUERY_TEMPLATE_PAGES) {
            setTemplatePages(templatePages);
        } else if (type === EDIT) {
            if (isInBuilder()) {
                // When users open html pages in builder,
                // we directly save new html content to fs
                // without having to do anything with editor
                if (noide.current.relativePath === relativePath) {
                    const file = noide.current;
                    const session = noide.getSession(file);
                    if (session) {
                        if (session.getValue() !== html) {
                            session.setValue(html, true);
                            fs.writeFileInBuilder(relativePath, html, (err, payload) => {
                                if (err) {
                                    return util.handleError(err);
                                }
                                file.stat = payload.stat;
                            });
                        }
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

let isIframeLoaded = false;
let pendingMessages = [];

function setIframeLoaded() {
    isIframeLoaded = true;
}

function sendPendingMessages() {
    pendingMessages.forEach(sendMessage);
}

function sendQueryTemplatePagesMessage() {
    sendMessage(new Message({
        type: QUERY_TEMPLATE_PAGES
    }));
}

function initBuilder(message) {
    if (isIframeLoaded) {
        sendMessage(message);
    } else {
        pendingMessages.push(message);
    }
    setWorkspaceInBuilder();
}

module.exports = {
    sendMessage,
    initMessageListener,
    Message,
    isInBuilder,
    ADD,
    EDIT,
    UPDATE_SHARED_JS,
    initBuilder,
    setIframeLoaded,
    sendPendingMessages,
    sendQueryTemplatePagesMessage,
    getTemplatePages
};