/**
 * Authentication routes
 */

var user = require('./../../controller/user');
var helper = require('./../../utility');
var config = require('./../../config/config.js').get(process.env.NODE_ENV);

module.exports = function (apiRoutes) {
    apiRoutes.post('/otp' + config.routes.user.verifyOtp, user.authController.verifyOtp);
    apiRoutes.post('/otp' + config.routes.user.resendOtp, user.authController.resendOtp);
}