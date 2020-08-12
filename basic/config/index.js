if (process.env.NODE_ENV === 'producetion') {
  module.exports = require('./prod')
} else {
  module.exports = require('./dev')
}