var patch = require('../patch')
var view = require('./view.html')
var fileMenu = require('../file-menu')
var noide = require('../noide')

function makeTree (files) {
  function treeify (list, idAttr, parentAttr, childrenAttr) {
    var treeList = []
    var lookup = {}
    var i, obj

    for (i = 0; i < list.length; i++) {
      obj = list[i]
      lookup[obj[idAttr]] = obj
      obj[childrenAttr] = []
    }

    for (i = 0; i < list.length; i++) {
      obj = list[i]
      var parent = lookup[obj[parentAttr]]
      if (parent) {
        obj.parent = parent
        lookup[obj[parentAttr]][childrenAttr].push(obj)
      } else {
        treeList.push(obj)
      }
    }

    return treeList
  }
  return treeify(files, 'path', 'dir', 'children')
}

function Tree (el) {
  function onClick (file) {
    if (file.isDirectory) {
      file.expanded = !file.expanded
      render()
    }
    return false
  }

  function showMenu (e, file) {
    e.stopPropagation()
    fileMenu.show((e.pageX - 2) + 'px', (e.pageY - 2) + 'px', file)
  }

  function render () {
    patch(el, view, makeTree(noide.files)[0].children, true, noide.current, showMenu, onClick)
  }

  noide.onAddFile(render)
  noide.onRemoveFile(render)
  noide.onChangeCurrent(render)
  render()
}

var treeEl = document.getElementById('tree')

var treeView = new Tree(treeEl)

module.exports = treeView
