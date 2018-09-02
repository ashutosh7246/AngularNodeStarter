/**
 * Utility functions
 */
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var sjcl = require('sjcl');
var error = require('./error');
var AuthTokenCollection = require('../sb_models/userData/auth_token.model');
var UserCollection = require('../sb_models/userData/user');
const appConfig = require('../../config/appConfig');
const helpers = require('../utility');
const config = require('../config/config');
const ObjectId = require('mongoose').Types.ObjectId;
const constants = require('./constants');
const bcrypt = require('bcrypt');
var mailHelper = require('./mail');
const dbconfig = require('../../config/dbConfig');

module.exports = {
    autheticationMiddleware: autheticationMiddleware,
    createAuthToken: createAuthToken,
    pagination: pagination,
    passwordGenrator: passwordGenrator,
    isPasswordExpired: isPasswordExpired,
    updateUserFailLoginAttempt: updateUserFailLoginAttempt,
    sendNewPasswordEmail: sendNewPasswordEmail,
    sendError: sendError,
    isValidMongooseObject: isValidMongooseObject,
    isStatusSuccess: isStatusSuccess,
    isStatusSuccess: isStatusSuccess,
    comparePassword: comparePassword
};

/**
 * Authentication middlewar, intercept requests
 * @param {object}   req  Request
 * @param {object}   res  Response
 * @param {cb}       next Pointer to next cb
 */
function autheticationMiddleware(req, res, next) {
    // next();
    // check header or url parameters or post parameters for token
    var header = req.headers.authorization;

    if (header) {
        console.log('header-------------------------->',header);
        var prefix = header.split(' ')[0];
        var token = header.split(' ')[1];
        console.log('prefix-------------------------->',prefix);
        console.log('token-------------------------->',token);

        // check for autheticated user
        // route middleware to verify a token
        if (prefix == 'Bearer') {
            // decode token
            if (token) {
                console.log('1-------------------------->');
                // Check if token exist
                AuthTokenCollection.find({ $or: [{ accessToken: token }, { refreshToken: token }] },
                    function (err, tokenList) {
                        // check if token is found or not
                        if (tokenList && Array.isArray(tokenList) && tokenList.length > 0) {
                            console.log('2-------------------------->');
                            // verifies secret and checks exp
                            jwt.verify(token, appConfig.jwtSecret, function (err, decoded) {
                                if (err) {
                                    console.log('3-------------------------->');
                                    return res.status(error.status.AuthenticationTimeout).json({
                                        error: error.message.AuthenticationTimeout,
                                        message: error.message.AuthenticationTimeout
                                    });
                                } else {
                                    console.log('4-------------------------->');
                                    let dbToken = tokenList[0];
                                    dbToken.lastActivityAt = new Date();
                                    dbToken.save(function (err) {
                                        if (err) {
                                            console.log('5-------------------------->');
                                            return sendError(err, res, next);
                                        }
                                        // if everything is good, save to request for use in other routes
                                        req.decoded = decoded;
                                        next();
                                    });
                                }
                            });
                        } else {
                            console.log('5-------------------------->');
                            return res.status(error.status.Unauthorized).json({
                                error: error.message.Unauthorized,
                                message: error.message.Unauthorized
                            });
                        }
                    });
            } else {
                // if there is no token
                // return an error
                console.log('6-------------------------->');
                return res.status(error.status.Forbidden).json({
                    error: error.message.Forbidden,
                    message: error.message.Forbidden
                });
            }
        } else if (prefix == 'Basic') {
            console.log('7-------------------------->');
            if (token) {
                console.log('8-------------------------->');
                var buf = sjcl.decrypt(config.get().specific.environment.sjclKey, token);
                var loginCredentials = {};
                loginCredentials.email = buf.toString().split(':')[0];
                loginCredentials.password = buf.toString().split(':')[1];

                // find user based on email who is active and not deleted
                UserCollection.findOne({
                    email: loginCredentials.email
                }, function (err, user) {
                    if (err) {
                        console.log('9-------------------------->');
                        return sendError(err, res, next);
                    } else if (!user) {
                        console.log('9-------------------------->');
                        // if no user found based on email,
                        // then it will return error in response
                        return res.status(error.status.Forbidden).json({
                            error: error.message.Forbidden,
                            message: error.message.Forbidden
                        });
                    } else if (user) {
                        console.log('10-------------------------->');
                        //Check if password matches
                        let compare = user.comparePassword(loginCredentials.password);
                        //Password matched
                        if (compare) {
                            console.log('11-------------------------->');
                            // if everything is good, save to request for use in other routes
                            if (req && req.decoded) {
                                req.decoded = decoded;
                            }
                            next();
                        } else {
                            console.log('13-------------------------->');
                            // password does not match, return error in response
                            return res.status(error.status.Unauthorized).json({
                                success: false,
                                message: error.message.invalidPassword
                            });
                        }
                    }
                });
            } else {
                console.log('14-------------------------->');
                // if there is no token
                // return an error
                return res.status(error.status.Forbidden).json({
                    error: error.message.Forbidden,
                    message: error.message.Forbidden
                });
            }
        } else {
            console.log('15-------------------------->');
            return res.status(error.status.Forbidden).json({
                error: error.message.Forbidden,
                message: error.message.Forbidden
            });
        }
    } else {
        console.log('16-------------------------->');
        return res.status(error.status.Forbidden).json({
            error: error.message.Forbidden,
            message: error.message.Forbidden
        });
    }
}

/**
 * Create authentication tokens
 * @param  {object} user User
 */
function createAuthToken(user) {
    var random = crypto.randomBytes(10).toString('hex');
    var userRandom = {};
    userRandom.id = user.userId;
    userRandom.random = random;
    var accessToken = jwt.sign(userRandom, appConfig.jwtSecret, {
        expiresIn: appConfig.tokenExpirationTime
        // expiresIn: 60 * 1 // Expires in a minute
    });
    user['accessToken'] = accessToken;
    var refreshToken = crypto.randomBytes(40).toString('hex');
    user['refreshToken'] = refreshToken;
    return user;
}

/**
 * Generate Pagination object containing totalPages, currentPage, hasPrevious, hasNext
 * @param  {int} page  Number of page(got from request)
 * @param  {int} count count
 * @param  {int} limit Limit of results per page
 */
function pagination(page, count, limit) {
    var previous = false,
        next = false,
        totalPages = 0;
    if (page) {
        page = (page < 0) ? 1 : page;
    } else {
        page = 1;
    }

    if (count < limit) {
        totalPages = 1;
    } else {
        totalPages = Math.ceil(count / limit);
    }
    previous = (page > 1) ? true : false;
    next = (page < totalPages) ? true : false;
    return { totalPages: totalPages, currentPage: page, hasPrevious: previous, hasNext: next };
}

/**
 * Generate password
 */
function passwordGenrator() {
    var keylist = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789",
        pass = '',
        plength = 8;
    for (i = 0; i < plength; i++) {
        pass += keylist.charAt(Math.floor(Math.random() * keylist.length));
    }
    return pass;
}

/**
 * Send error
 * @param  {object}   err  Error
 * @param  {object}   res  Response
 * @param  {nect}     next cb to next function
 */
function sendError(err, res, next) {
    if (Array.isArray(err)) {
        return res.status(error.status.InternalServerError).json({
            success: false,
            message: error.message.InternalServerError
        });
    } else {
        if (next) {
            return next(err);
        } else {
            return res.status(error.status.InternalServerError).json({
                success: false,
                message: error.message.InternalServerError
            });
        }
    }
}

function isValidMongooseObject(object) {
    let isValid = false;
    if (object) {
        try {
            let newObject = new ObjectId(object);
            isValid = newObject.toString() === object;
        } catch (e) {
            console.log(object, 'is not valid mongoose object');
        }
    }
    return isValid;
}

function isStatusSuccess(status) {
    return (status === 200 || status === 204 || status === 304) ? true : false;
}

/**
 * 
 * @param {*} lastPasswordUpdatedAt : Passwored generated/updated time in millisecond
 */
function isPasswordExpired(lastPasswordUpdatedAt) {
    return ((new Date().getTime() - lastPasswordUpdatedAt) > appConfig.passwordExpirationTime) ? true : false;
}


function updateUserFailLoginAttempt(userRefId) {
    UserCollection.findById(userRefId, (err, user) => {
        if (err) {
            console.log('Unable to update user fail login attempt for: ', userRefId);
        } else if (user) {
            user.invalidLoginAttempts = (user.invalidLoginAttempts || 0) + 1;
            // Update fail login attempt
            user.save((err) => {
                if (err) {
                    console.log('Unable to update user fail login attempt for: ', userRefId);
                } else {
                    // password does not match, return error in response
                    console.log('User fail login attempt updated for: ', userRefId);
                }
            });
        } else {
            console.log('No user found with reference id: ', userRefId);
        }
    });
}



async function sendNewPasswordEmail(userEmail) {
    sendMailFunction = async (resolve, reject) => {
        UserCollection.findOne({ email: userEmail }, (err, user) => {
            if (err) {
                console.log('Unable to send new passowrd email to: ', userEmail);
                reject(false);
            } else if (user) {
                let randomPass = Math.random().toString(36).slice(-8) + '@react2018';
                let update = {
                    isPasswordChanged: false,
                    password: randomPass,
                    lastPasswordUpdatedAt: new Date().getTime()
                };
                bcrypt.genSalt(dbconfig.saltIteration, (err, salt) => {
                    bcrypt.hash(update.password, salt, (err, hash) => {
                        if (err) {
                            console.log('Unable to send new passowrd email to: ', userEmail);
                            reject(false);
                        } else {
                            update.password = hash;
                            // Update User
                            UserCollection.findByIdAndUpdate(user._id, update, (err, updatedUser) => {
                                if (err) {
                                    console.log('Unable to send new passowrd email to: ', userEmail);
                                    reject(false);
                                } else {
                                    // send reset password mail
                                    var mailParams = {};
                                    mailParams.email = updatedUser.email;
                                    mailParams.subject = mailHelper.subject.resetPassword;
                                    mailParams.firstName = updatedUser.firstName;
                                    mailParams.newpass = randomPass;
                                    mailHelper.sendMail('resetPasswordOnMultipleLogin', mailParams, success, failure);

                                    // success in sending mail to user
                                    function success() {
                                        console.log('New password : Success in sending mail: ', userEmail);
                                        resolve(true);
                                    }
                                    // failure in sending mail to user
                                    function failure() {
                                        console.log('New password : Failure in sending mail: ', userEmail);
                                        reject(false);
                                    }
                                }
                            });
                        }
                    });
                });
            } else {
                console.log('No user found with email: ', userEmail);
                reject(false);
            }
        });
    }
    let promise = new Promise(sendMailFunction);
    return promise;
}

function comparePassword(newPassword, oldPassword) {
    return bcrypt.compareSync(newPassword, oldPassword); // Returns true if password matches, false if doesn't
}