var path = require('path')
var argv = require('./argv')

var config = {
  ace: {
    tabSize: 2,
    fontSize: 20,
    theme: 'eclipse',
    useSoftTabs: true
  }
}

if (argv.client) {
  config = require(path.resolve(process.cwd(), argv.client))
}

module.exports = config
