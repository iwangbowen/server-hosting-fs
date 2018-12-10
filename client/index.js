const client = require('./client');
const util = require('./util');
const splitter = require('./splitter');
const editor = require('./editor');
const noide = require('./noide');
const watch = require('./watch');
const { initMessageListener, setIframeLoaded, sendPendingMessages } = require('./message');
const initPage = require('./page');

window.onbeforeunload = function () {
  if (noide.dirty.length) {
    return 'Unsaved changes will be lost - are you sure you want to leave?';
  }
}

document.getElementById('iframe').onload = function () {
  setIframeLoaded();
  sendPendingMessages();
};

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

    splitter(document.getElementById('sidebar-workspaces'), false, resizeEditor);
    // splitter(document.getElementById('workspaces-info'), true, resizeEditor)
    splitter(document.getElementById('main-footer'), true, resizeEditor);

    initPage();
  })
});