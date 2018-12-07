const workspacesEl = document.getElementById('workspaces');

function setWorkspace(className) {
    workspacesEl.className = className || 'welcome';
}

function getWorkspace() {
    return workspacesEl.className;
}

function setWorkspaceInEditor() {
    setWorkspace('editor');
}

function setWorkspaceInBuilder() {
    setWorkspace('builder');
}

module.exports = {
    setWorkspace,
    setWorkspaceInBuilder,
    setWorkspaceInEditor,
    getWorkspace
};