let savedInEditor = false;

function setSavedInEditor(value) {
  savedInEditor = value;
}

function getSavedInEditor() {
  return savedInEditor;
}

module.exports = {
    setSavedInEditor,
    getSavedInEditor
}