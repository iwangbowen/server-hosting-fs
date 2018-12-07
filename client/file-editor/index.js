var page = require('page')
var patch = require('../patch')
var fs = require('../fs')
var view = require('./view.html')
const { ADD, Message, initBuilder } = require('../message');

function FileEditor(el) {
  var model = {
    mode: null,
    file: null,
    callback: null,
    rename: fs.rename,
    mkfile: function (path) {
      fs.mkfile(path, this.callback);
    },
    mkdir: fs.mkdir
  }

  function hide() {
    model.file = null
    model.mode = null
    patch(el, view, model, hide)
  }

  function show(file, mode, openInBuilder, template) {
    model.file = file;
    model.mode = mode;
    model.callback = (err, payload) => {
      if (!err) {
        // Open the new file. Leave a short delay
        // to allow it to register from the socket
        setTimeout(() => {
          if (openInBuilder) {
            initBuilder(new Message({
              type: ADD,
              template: template,
              relativePath: payload.relativePath
            }), payload.relativePath);
          } else {
            page('/file?path=' + payload.relativePath);
          }
        }, 750);
      }
    };
    patch(el, view, model, hide);
    var input = el.querySelector('input');
    input.focus();
  }

  this.show = show
}
FileEditor.prototype.rename = function (file) {
  this.show(file, 'rename')
}
FileEditor.prototype.mkfile = function (dir, openInBuilder = false, template) {
  this.show(dir, 'mkfile', openInBuilder, template);
}
FileEditor.prototype.mkdir = function (dir) {
  this.show(dir, 'mkdir')
}

var fileEditorEl = document.getElementById('file-editor')
var fileEditor = new FileEditor(fileEditorEl)

module.exports = fileEditor
