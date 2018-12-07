const page = require('page');
const qs = require('querystring');
const noide = require('./noide');
const fs = require('./fs');
const editor = require('./editor');
const { setWorkspace } = require('./workspace');
const { initBuilder, EDIT, Message } = require('./message');

module.exports = function initPage() {
    page('*', function (ctx, next) {
        // Update current file state
        noide.current = null
        next()
    })

    page('/', function (ctx) {
        setWorkspace()
    })

    page('/file', function (ctx, next) {
        const { path: relativePath, openInBuilder } = qs.parse(ctx.querystring);
        const file = noide.getFile(relativePath);

        if (!file) {
            return next()
        }

        let session = noide.getSession(file)

        function setSession() {
            setWorkspace('editor');
            // Update state
            noide.current = file;
            if (!noide.hasRecent(file)) {
                noide.addRecent(file)
            }
            // Set the editor session
            editor.setSession(session.editSession)
            editor.resize()
            editor.focus()
        }

        function initMessage() {
            return new Message({
                type: EDIT,
                html: session.getValue(),
                path: file.path,
                relativePath
            });
        }

        function initWorkspace() {
            if (openInBuilder === 'true') {
                initBuilder(initMessage(), relativePath);
            } else {
                setSession();
            }
        }

        if (session) {
            initWorkspace();
        } else {
            fs.readFile(relativePath, function (err, payload) {
                if (err) {
                    return util.handleError(err);
                }
                session = noide.addSession(file, payload.contents);
                initWorkspace();
            })
        }
    })

    page('*', function (ctx) {
        setWorkspace('not-found')
    })

    page({
        hashbang: true
    })
}