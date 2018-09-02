var configDev = require('./config-dev.js');
var configProd = require('./config-prod.js');

exports.get = function get(env) {
    return environment = {
        routes: {
            user: {
                register: '/register',
                authenticate: '/authenticate',
                verifyOtp: '/verifyOtp',
                resendOtp: '/resendOtp',
                changePassword: '/changePassword',
                forgotUserPassword: '/forgotUserPassword',
                logout: '/logout'
            },
        },
        specific: configProd[env] || configDev.default
    }
    // return configProd[env] || configDev.default;
}