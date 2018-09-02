/**
 * Authentication routes
 */

var user = require('./../../controller/user');
var helper = require('./../../utility');
var config = require('./../../config/config.js').get(process.env.NODE_ENV);

module.exports = function (apiRoutes) {
    apiRoutes.post('/myprofile' + config.routes.user.register, user.authController.register);
    apiRoutes.put('/myprofile' + config.routes.user.changePassword, user.authController.changePassword);
    apiRoutes.post('/myprofile' + config.routes.user.forgotUserPassword, user.authController.forgotUserPassword);
    apiRoutes.post('/myprofile' + config.routes.user.authenticate, user.authController.authenticate);
    // With Middleware
    apiRoutes.post('/myprofile' + config.routes.user.logout, helper.util.autheticationMiddleware, user.authController.logout);
}