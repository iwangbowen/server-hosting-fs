var fs = require('./fs')
var client = require('./client')
var util = require('./util')
var noide = require('./noide')
const { isInBuilder, sendMessage, Message, EDIT } = require('./message');

function watch() {
  function handleError(err) {
    if (err) {
      return util.handleError(err)
    }
  }

  // Subscribe to watched file changes
  // that happen on the file system
  // Reload the session if the changes
  // do not match the state of the file
  client.subscribe('/fs/change', function (payload) {
    noide.sessions.forEach(function (session) {
      const file = session.file;
      if (payload.path === file.path) {
        if (payload.stat.mtime !== file.stat.mtime) {
          fs.readFile(file.path, function (err, payload) {
            if (err) {
              return util.handleError(err);
            }
            file.stat = payload.stat;
            if (session.getValue() !== payload.contents) {
              session.setValue(payload.contents, true)
              if (isInBuilder()) {
                sendMessage(new Message({
                  type: EDIT,
                  html: session.getValue(),
                  path: file.path,
                  relativePath: file.relativePath
                }));
              }
            }
          })
        }
      }
    })
  }, handleError)

  client.subscribe('/fs/add', function (payload) {
    noide.addFile(payload)
  }, handleError)

  client.subscribe('/fs/addDir', function (payload) {
    noide.addFile(payload)
  }, handleError)

  client.subscribe('/fs/unlink', function (payload) {
    var file = noide.getFile(payload.relativePath)
    if (file) {
      noide.removeFile(file)
    }
  }, handleError)

  client.subscribe('/fs/unlinkDir', function (payload) {
    var file = noide.getFile(payload.relativePath)
    if (file) {
      noide.removeFile(file)
    }
  }, handleError)
}

module.exports = watch
