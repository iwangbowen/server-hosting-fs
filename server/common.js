var util = require('util')

module.exports = {
  extend: util._extend,
  rndstr: function () {
    return (+new Date()).toString(36)
  },
  getuid: function () {
    return ('' + Math.random()).replace(/\D/g, '')
  },
  isDevEnv: require('process').env.NODE_ENV === 'development'
}
