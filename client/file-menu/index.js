var patch = require('../patch');
var fs = require('../fs');
var util = require('../util');
var fileEditor = require('../file-editor');
var view = require('./view.html');
var copied;
var $ = window.jQuery;
var path = require('path');
const { sendMessage, Message, UPDATE_SHARED_JS, ADD, getTemplatePages } = require('../message');
const page = require('page');

function FileMenu(el) {
  var $el = $(el)
  // $el.on('mouseleave', function () {
  //   hide()
  // })
  // https://stackoverflow.com/questions/1403615/use-jquery-to-hide-a-div-when-the-user-clicks-outside-of-it
  $(document).mouseup(e => {
    // if the target of the click isn't the container nor a descendant of the container
    if (!$el.is(e.target) && $el.has(e.target).length === 0) {
      hide();
    }
  });

  function callback(err, payload) {
    if (err) {
      return util.handleError(err)
    }
  }

  function resetPasteBuffer() {
    copied = null
  }

  function setPasteBuffer(file, action) {
    hide()
    copied = {
      file: file,
      action: action
    }
  }

  function showPaste(file) {
    if (copied) {
      var sourcePath = copied.file.relativePath.toLowerCase()
      var sourceDir = copied.file.relativeDir.toLowerCase()
      var destinationDir = (file.isDirectory ? file.relativePath : file.relativeDir).toLowerCase()
      var isDirectory = copied.file.isDirectory

      if (!isDirectory) {
        // Always allow pasteing of a file unless it's a move operation (cut) and the destination dir is the same
        return copied.action !== 'cut' || destinationDir !== sourceDir
      } else {
        // Allow pasteing directories if not into self a decendent
        if (destinationDir.indexOf(sourcePath) !== 0) {
          // and  or if the operation is move (cut) the parent dir too
          return copied.action !== 'cut' || destinationDir !== sourceDir
        }
      }
    }
    return false
  }

  function rename(file) {
    hide()
    resetPasteBuffer()
    fileEditor.rename(file)
  }

  function paste(file) {
    hide()
    if (copied && copied.file) {
      var action = copied.action
      var source = copied.file
      resetPasteBuffer()

      var pastePath = file.isDirectory ? file.path : file.dir

      if (action === 'copy') {
        fs.copy(source.path, path.resolve(pastePath, source.name), callback)
      } else if (action === 'cut') {
        fs.rename(source.path, path.resolve(pastePath, source.name), callback)
      }
    }
  }

  function mkfile(file) {
    hide()
    resetPasteBuffer()
    fileEditor.mkfile(file.isDirectory ? file : file.parent)
  }

  function mkNewPage(file, template) {
    hide();
    resetPasteBuffer();
    fileEditor.mkfile(file.isDirectory ? file : file.parent, true, template);
  }

  function openInBuilder(file) {
    hide();
    page(`/file?path=${file.relativePath}&openInBuilder=true`);
  }

  function updateSharedJS(file) {
    const { path, relativePath } = file;
    sendMessage(new Message({
      type: UPDATE_SHARED_JS,
      path,
      relativePath
    }));
    hide();
  }

  function mkdir(file) {
    hide();
    resetPasteBuffer();
    fileEditor.mkdir(file.isDirectory ? file : file.parent);
  }

  function remove(file) {
    const path = file.relativePath;
    hide();
    resetPasteBuffer();
    if (window.confirm(`Delete ${path}`)) {
      fs.remove(path, callback);
    }
  }

  function quit() {
    hide();
  }

  const model = {
    x: 0,
    y: 0,
    file: null,
    rename,
    paste,
    mkfile,
    mkdir,
    remove,
    showPaste,
    setPasteBuffer,
    openInBuilder,
    quit,
    mkNewPage,
    updateSharedJS,
    getTemplatePages
  };

  function hide() {
    model.file = null
    patch(el, view, model)
  }

  function show(x, y, file) {
    model.x = x
    model.y = y
    model.file = file
    patch(el, view, model)
  }

  this.show = show
}

var fileMenuEl = document.getElementById('file-menu')
var fileMenu = new FileMenu(fileMenuEl)

module.exports = fileMenu;
