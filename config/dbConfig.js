var config = require("../server/config/config.js").get(process.env.NODE_ENV);

module.exports = {
  // database: 'mongodb://stoylAdmin:gavaskar@ds139884.mlab.com:39884/stoyl_brain',
  secret: 'tendulkar',
  saltIteration: 12,
  database: config.specific.database
}
