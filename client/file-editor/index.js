var page = require('page')
var patch = require('../patch')
var fs = require('../fs')
var view = require('./view.html')

function FileEditor(el) {
  var model = {
    mode: null,
    file: null,
    openInBuilder: false,
    template: null,
    callback: null,
    rename: fs.rename,
    mkfile: function (path) {
      fs.mkfile(path, (err, payload) => {
        if (!err) {
          // Open the new file. Leave a short delay
          // to allow it to register from the socket
          setTimeout(() => {
            if (this.openInBuilder) {
              this.callback(this.template, payload.relativePath);
            } else {
              page('/file?path=' + payload.relativePath);
            }
          }, 750);
        }
      });
    },
    mkdir: fs.mkdir
  }

  function hide() {
    model.file = null
    model.mode = null
    patch(el, view, model, hide)
  }

  function show(file, mode, openInBuilder, template, callback) {
    model.file = file;
    model.mode = mode;
    model.openInBuilder = openInBuilder;
    model.template = template;
    model.callback = callback;
    patch(el, view, model, hide);
    var input = el.querySelector('input');
    input.focus();
  }

  this.show = show
}
FileEditor.prototype.rename = function (file) {
  this.show(file, 'rename')
}
FileEditor.prototype.mkfile = function (dir, openInBuilder = false, template, callback) {
  this.show(dir, 'mkfile', openInBuilder, template, callback);
}
FileEditor.prototype.mkdir = function (dir) {
  this.show(dir, 'mkdir')
}

var fileEditorEl = document.getElementById('file-editor')
var fileEditor = new FileEditor(fileEditorEl)

module.exports = fileEditor
