var config = require("../server/config/config.js").get(process.env.NODE_ENV);

module.exports = {
  secret: 'tendulkar',
  saltIteration: 12,
  database: config.specific.database
}
