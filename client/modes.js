const modes = {
  '.js': 'ace/mode/javascript',
  '.css': 'ace/mode/css',
  '.scss': 'ace/mode/scss',
  '.less': 'ace/mode/less',
  '.html': 'ace/mode/html',
  '.htm': 'ace/mode/html',
  '.ejs': 'ace/mode/html',
  '.json': 'ace/mode/json',
  '.md': 'ace/mode/markdown',
  '.coffee': 'ace/mode/coffee',
  '.jade': 'ace/mode/jade',
  '.java': 'ace/mode/java',
  '.php': 'ace/mode/php',
  '.py': 'ace/mode/python',
  '.sass': 'ace/mode/sass',
  '.txt': 'ace/mode/text',
  '.typescript': 'ace/mode/typescript',
  '.gitignore': 'ace/mode/gitignore',
  '.xml': 'ace/mode/xml',
  '.dockerfile': 'ace/mode/dockerfile',
  '.gitignore': 'ace/mode/gitignore',
  '.jsp': 'ace/mode/jsp',
  '.less': 'ace/mode/less',
  '.markdown': 'ace/mode/markdown'
};

module.exports = function (file) {
  return modes[file.ext];
}
