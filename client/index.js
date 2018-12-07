const page = require('page');
const qs = require('querystring');
const fs = require('./fs');
const client = require('./client');
const util = require('./util');
const splitter = require('./splitter');
const editor = require('./editor');
const noide = require('./noide');
const watch = require('./watch');
const { initMessageListener } = require('./message');
const { setWorkspace } = require('./workspace');

window.onbeforeunload = function () {
  if (noide.dirty.length) {
    return 'Unsaved changes will be lost - are you sure you want to leave?';
  }
}

initMessageListener();

client.connect(function (err) {
  if (err) {
    return util.handleError(err);
  }

  client.request('/watched', function (err, payload) {
    if (err) {
      return util.handleError(err);
    }

    noide.load(payload);

    // Save state on page unload
    window.onunload = function () {
      noide.saveState();
    }

    // Build the tree pane
    require('./tree')

    // Build the recent list pane
    // require('./recent')

    // Build the procsses pane
    var processesView = require('./processes')

    // Subscribe to watched file changes
    // that happen on the file system
    watch()

    // Subscribe to editor changes and
    // update the recent files views
    editor.on('input', function () {
      noide.onInput()
    })

    /* Initialize the splitters */
    function resizeEditor() {
      editor.resize()
      processesView.editor.resize()
    }

    splitter(document.getElementById('sidebar-workspaces'), false, resizeEditor)
    // splitter(document.getElementById('workspaces-info'), true, resizeEditor)
    splitter(document.getElementById('main-footer'), true, resizeEditor)

    page('*', function (ctx, next) {
      // Update current file state
      noide.current = null
      next()
    })

    page('/', function (ctx) {
      setWorkspace()
    })

    page('/file', function (ctx, next) {
      var relativePath = qs.parse(ctx.querystring).path
      var file = noide.getFile(relativePath)

      if (!file) {
        return next()
      }

      var session = noide.getSession(file)

      function setSession() {
        setWorkspace('editor')

        // Update state
        noide.current = file

        if (!noide.hasRecent(file)) {
          noide.addRecent(file)
        }

        // Set the editor session
        editor.setSession(session.editSession)
        editor.resize()
        editor.focus()
      }

      if (session) {
        setSession()
      } else {
        fs.readFile(relativePath, function (err, payload) {
          if (err) {
            return util.handleError(err)
          }

          session = noide.addSession(file, payload.contents)
          setSession()
        })
      }
    })

    page('*', function (ctx) {
      setWorkspace('not-found')
    })

    page({
      hashbang: true
    })
  })
});