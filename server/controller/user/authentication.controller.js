const jwt = require('jsonwebtoken');

const User = require('../../sb_models/userData/user');
const AuthToken = require('../../sb_models/userData/auth_token.model');
const CounterSchema = require('../../sb_models/setupData/counter');
const OtpCollection = require('../../sb_models/shared/otp');

const appConfig = require('../../../config/appConfig');
const helpers = require('../../utility');
const bcrypt = require('bcrypt');
const dbconfig = require('../../../config/dbConfig');
var mailHelper = require('../../utility/mail');

module.exports = {
    register: register,
    authenticate: authenticate,
    logout: logout,
    verifyOtp: verifyOtp,
    resendOtp: resendOtp,
    changePassword: changePassword,
    forgotUserPassword: forgotUserPassword
};

// Register new user
function register(req, res, next) {
    if (!req.body.firstName || req.body.firstName === null || req.body.firstName === '' ||
        !req.body.lastName || req.body.lastName === null || req.body.lastName === '' ||
        !req.body.password || req.body.password === null || req.body.password === '' ||
        !req.body.email || req.body.email === null || req.body.email === '' ) {
        res.json({
            success: false,
            msg: 'Ensure username, email, password and role were provided'
        });
    } else {
        let newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password
        });
        CounterSchema.findOneAndUpdate(
            { model: 'userProfiles', field: 'userId', prefix: 'BU' },
            { $inc: { seq: 1 } },
            {
                new: true,
                upsert: true
            },
            (err, _counter) => {
                if (err) {
                    res.json({
                        success: false,
                        message: 'Error while registering new user. Error: ' + err
                    });
                } else {
                    newUser.userId = _counter.prefix + _counter.seq;
                    newUser.save((err) => {
                        if (err) {
                            // Check if any validation errors exists (from user model)
                            if (err.errors && err.errors !== null) {
                                if (err.errors.email) {
                                    res.json({
                                        success: false,
                                        message: err.errors.email.message
                                    }); // Display error in validation (email)
                                } else if (err.errors.password) {
                                    res.json({
                                        success: false,
                                        message: err.errors.password.message
                                    }); // Display error in validation (password)
                                } else {
                                    res.json({
                                        success: false,
                                        message: err
                                    }); // Display any other errors with validation
                                }
                            } else if (err) {
                                // Check if duplication error exists
                                if (err.code == 11000) {
                                    if (err.errmsg[63] == "e") {
                                        res.json({
                                            success: false,
                                            message: 'That e-mail is already taken'
                                        }); // Display error if e-mail already taken
                                    } else {
                                        res.json({
                                            success: false,
                                            message: err
                                        }); // Display any other error    
                                    }
                                } else {
                                    res.json({
                                        success: false,
                                        message: err
                                    }); // Display any other error
                                }
                            }
                        } else {
                            res.json({
                                success: true,
                                message: 'Account registered'
                            }); // Send success message back to controller/request        
                        }
                    });
                }
            }
        );
    }
}

//Authenticate user upon login 
function authenticate(req, res, next) {
    // get authentication credentials from request
    var params = req.body;
    console.log('1 ==================================>',req.body);
    // check if authorization header is present or not in request
    if (req.headers.authorization) {
        console.log('2==================================>');

        // get autorization header
        var athorizationToken = req.headers.authorization.split(" ")[1];

        // Check whether params have key grant_type or not
        if (params.grantType == 'password') {
            // if yes, then it will verify email and password
            // and then give access and refresh token

            // get values from authorization header
            var buf = new Buffer(athorizationToken, 'base64');
            var loginCredentials = {};
            loginCredentials.email = buf.toString().split(':')[0];
            loginCredentials.password = buf.toString().split(':')[1];
            console.log('3==================================>',loginCredentials);

            // find user based on email who is active and not deleted
            User.findOne({
                email: loginCredentials.email
            }, function (err, user) {
                if (err) {
                    helpers.util.sendError(err, res, next);
                }
                if (!user) {
                    // if no user found based on email,
                    // then it will return error in response
                    return res.status(helpers.error.status.Unauthorized).json({
                        success: false,
                        message: helpers.error.message.emailNotFound
                    });
                } else if (user) {
                    if (!user.active) {
                        return res.status(helpers.error.status.Unauthorized).json({
                            success: false,
                            message: helpers.error.message.deactivated
                        });
                    }
                    //Check if password matches
                    let compare = user.comparePassword(loginCredentials.password);
                    //Password matched
                    if (compare) {
                        console.log('4.1==================================>',user);
                        console.log('5.1==================================>',compare);
                        if (helpers.util.isPasswordExpired(user.lastPasswordUpdatedAt)) {
                            user.isPasswordChanged = false;
                        }

                        // Update fail login attempt to 0
                        user.invalidLoginAttempts = 0;
                        user.lastPasswordUpdatedAt = (!user.lastPasswordUpdatedAt) ? new Date().getTime() : user.lastPasswordUpdatedAt;
                        user.save((err) => {
                            if (err) {
                                console.log('lastPasswordUpdatedAt not saved : ', err);
                            } else {
                                console.log('lastPasswordUpdatedAt saved : ', user.lastPasswordUpdatedAt);
                            }
                        });

                        // Generate and Save OTP
                        helpers.otp.generateAndSendOTP(user._id).then((otpObject) => {
                            return res.status(helpers.success.status.OK).json({
                                success: true,
                                data: {
                                    time: otpObject.generatedAt,
                                    userRefId: user._id,
                                    dummyOtp: otpObject.dummyOtp
                                },
                                message: helpers.success.message.otpSent
                            });
                            // generatedAuthentication(req, res, next, user);
                        }, (error) => {
                            return res.status(helpers.error.status.InternalServerError).json({
                                success: false,
                                message: helpers.error.message.InternalServerError
                            });
                        });
                    } else {
                        console.log('4.2==================================>',user);
                        console.log('5.2==================================>',compare);
                        // password does not match, return error in response
                        // return res.status(helpers.error.status.Unauthorized).json({
                        //     success: false,
                        //     message: helpers.error.message.invalidPassword
                        // });
                        // password does not match, return error in response
                        if (user.invalidLoginAttempts === 2) {
                            helpers.util.sendNewPasswordEmail(user.email).then(
                                (sent) => {
                                    helpers.util.updateUserFailLoginAttempt(user._id);
                                    return res.status(helpers.error.status.Unauthorized).json({
                                        success: false,
                                        maxFailLoginAttempt: true,
                                        message: helpers.error.message.maxFailLoginAttemptWitMail
                                    });
                                },
                                (error) => {
                                    return res.status(helpers.error.status.Unauthorized).json({
                                        success: false,
                                        maxFailLoginAttempt: false,
                                        message: helpers.error.message.invalidPassword
                                    });
                                }
                            );
                        } else {
                            let message = (user.invalidLoginAttempts > 2) ? helpers.error.message.maxFailLoginAttempt : helpers.error.message.invalidPassword;
                            helpers.util.updateUserFailLoginAttempt(user._id);
                            return res.status(helpers.error.status.Unauthorized).json({
                                success: false,
                                maxFailLoginAttempt: false,
                                message: message
                            });
                        }
                    }
                } else {
                    // email not found, return error in response
                    return res.status(helpers.error.status.Unauthorized).json({
                        success: false,
                        message: helpers.error.message.emailNotFound
                    });
                }
            });
        } else if (params.grantType == 'accessToken') {
            // grant type is found accesstoken
            // it will verify refresh token
            // and then generate new access token

            // find token which has the refresh token same as refresh token got from request
            AuthToken.find({ refreshToken: athorizationToken }, function (err, tokenList) {
                if (err) {
                    helpers.util.sendError(err, res, next);
                }

                // check if token is found or not
                if (tokenList && Array.isArray(tokenList) && tokenList.length > 0) {
                    var token = tokenList[0];
                    // Check expiration of refresh token
                    var timeDiff = appConfig.refreshTokenExpirationTime - ((new Date().getTime() - new Date(token.lastActivityAt).getTime()) / 1000);

                    // If session has been expired then return
                    if (timeDiff <= 0) {
                        // Reomve Tokens
                        AuthToken.findByIdAndRemove({ _id: token._id }, (err) => {
                            if (err) {
                                return helpers.util.sendError(err, res, next);
                            }
                            // Send session timeout
                            return res.status(helpers.error.status.SessionTimeout).json({
                                success: false,
                                message: helpers.error.message.SessionTimeout
                            });
                        });
                    } else {
                        // generate new access token
                        token = helpers.util.createAuthToken(token);

                        // save newly generated access and refresh token
                        AuthToken.findById(token._id, function (err, currToken) {
                            if (err) {
                                helpers.util.sendError(err, res, next);
                            }

                            currToken.accessToken = token.accessToken;
                            currToken.refreshToken = token.refreshToken;

                            currToken.save(function (err) {
                                if (err) {
                                    helpers.util.sendError(err, res, next);
                                }
                                return res.status(helpers.success.status.OK).send(token);
                            });
                        });
                    }

                } else {
                    // token not found, return error in response
                    return res.status(helpers.error.status.Unauthorized).json({
                        success: false,
                        message: helpers.error.message.invalidToken
                    });
                }
            });
        } else {
            // grant type not found, return error in response
            return res.status(helpers.error.status.Unauthorized).josn({
                success: false,
                message: helpers.error.message.grantTypeNotFound
            });
        }
    } else {
        // authorization header not found, return error in response
        return res.status(helpers.error.status.Unauthorized).json({
            success: false,
            message: helpers.error.message.authorizationNotFound
        });
    }
}

function logout(req, res, next) {
    var userId = req.body.userId;
    if (req.headers.authorization && userId) {
        // get autorization header
        var athorizationToken = req.headers.authorization.split(" ")[1];
        // find token which has the refresh token same as refresh token got from request
        AuthToken.findOneAndRemove({ userId: userId, accessToken: athorizationToken }, (err) => {
            if (err) {
                return helpers.util.sendError(err, res, next);
            }
            return res.status(helpers.success.status.OK).json({
                success: true,
                message: 'User logged out successfully.'
            });
        });
    } else {
        return res.status(helpers.success.status.OK).json({
            success: false,
            message: 'UserId or authorization token not provided!'
        });
    }
}


function verifyOtp(req, res, next) {
    if (req.body.userRefId && req.body.otp && req.body.time && req.body.dummyOtp) {
        User.findById(req.body.userRefId, (err, user) => {
            if (err) {
                res.json({
                    success: false,
                    message: 'Unable to verify OTP. Try again Later!'
                });
            } else if (user) {
                OtpCollection.findOne({
                    otp: req.body.otp,
                    generatedAt: req.body.time,
                    dummyOtp: req.body.dummyOtp,
                    userRefId: req.body.userRefId,
                    isExpired: false,
                    isDeleted: false
                }, (err, otp) => {
                    if (err) {
                        res.json({
                            success: false,
                            message: 'Unable to verify OTP. Try again Later!'
                        });
                    } else if (otp) {
                        if (helpers.otp.isOTPExpired(otp.generatedAt)) {
                            res.json({
                                success: false,
                                isExpired: true,
                                message: 'OTP has been expired!'
                            });
                        } else {
                            // OTP verification success
                            generatedAuthentication(req, res, next, user);
                        }
                        helpers.otp.deleteOTP(otp._id);
                    } else {
                        res.json({
                            success: false,
                            message: 'Invalid OTP!'
                        });
                    }
                });
            } else {
                res.json({
                    success: false,
                    message: 'Unable to verify User. Try again Later!'
                });
            }
        })
    } else {
        res.json({
            success: false,
            message: 'Insufficent data to verify OTP!'
        });
    }
}

function generatedAuthentication(req, res, next, user) {
    // create an access token
    var userWithToken = helpers.util.createAuthToken(user);
    var newAuthToken = new AuthToken({
        accessToken: userWithToken.accessToken,
        refreshToken: userWithToken.refreshToken,
        lastActivityAt: new Date(),
        userId: userWithToken.userId,
        userAgent: req.headers['user-agent']
    });
    newAuthToken.save(function (err, authToken) {
        if (err) {
            helpers.util.sendError(err, res, next);
        }
        return res.status(helpers.success.status.OK).json({
            success: true,
            user: user,
            auth: authToken
        });
    });
}

// getUSR();
function getUSR() {
    User.findById('5acf07ec6639722f171cbb6b', (err, user) => {
        if (err) {
            console.log('user not found');
        } else {
            console.log('--------------->', user);
        }
    });
}
function resendOtp(req, res, next) {
    console.log('1-------->', req.body.userRefId);
    if (req.body.userRefId && req.body.time && req.body.dummyOtp) {
        console.log('2-------->', req.body.userRefId);
        User.findById(req.body.userRefId, (err, user) => {
            if (err) {
                res.json({
                    success: false,
                    message: 'Unable to verify OTP. Try again Later!'
                });
            } else if (user) {
                OtpCollection.findOne({
                    generatedAt: req.body.time,
                    dummyOtp: req.body.dummyOtp,
                    userRefId: req.body.userRefId,
                    isExpired: false,
                    isDeleted: false
                }, (err, otp) => {
                    if (err) {
                        res.json({
                            success: false,
                            message: 'Unable to send OTP. Try again Later!'
                        });
                    } else if (otp) {
                        if (helpers.otp.isOTPExpired(otp.generatedAt)) {
                            helpers.otp.deleteOTP(otp._id);
                            // Generate and Save OTP
                            helpers.otp.generateAndSendOTP(user._id).then((otpObject) => {
                                return res.status(helpers.success.status.OK).json({
                                    success: true,
                                    data: {
                                        time: otpObject.generatedAt,
                                        dummyOtp: otpObject.dummyOtp,
                                        userRefId: user._id
                                    },
                                    message: helpers.success.message.otpReSent
                                });
                            }, (error) => {
                                return res.status(helpers.error.status.InternalServerError).json({
                                    success: false,
                                    message: helpers.error.message.InternalServerError
                                });
                            });
                        } else {
                            let time = new Date().getTime();
                            otp.dummyOtp = helpers.otp.generateOTP();
                            otp.generatedAt = time;
                            otp.save((err) => {
                                if (err) {
                                    res.json({
                                        success: false,
                                        message: 'Unable to send OTP. Try again Later!'
                                    });
                                } else {
                                    helpers.otp.sendOTPEmail(otp.otp, user).then((sent) => {
                                        res.json({
                                            success: true,
                                            data: {
                                                dummyOtp: otp.dummyOtp,
                                                userRefId: user._id,
                                                time: time,
                                            },
                                            message: 'OTP re-sent success!'
                                        });
                                    }, (error) => {
                                        res.json({
                                            success: false,
                                            message: 'Unable to send OTP. Try again Later!'
                                        });
                                    });
                                }
                            })
                        }
                    } else {
                        res.json({
                            success: false,
                            message: 'Invalid Request!'
                        });
                    }
                });
            } else {
                console.log('-------->', user);
                res.json({
                    success: false,
                    message: 'Unable to send User. Try again Later!'
                });
            }
        });
    } else {
        res.json({
            success: false,
            message: 'Insufficent data!'
        });
    }
}

function forgotUserPassword(req, res, next) {

    if (req.body.email) {
        let randomPass = Math.random().toString(36).slice(-8) + '@react2018';
        let update = {
            isPasswordChanged: false,
            lastPasswordUpdatedAt: new Date().getTime(),
            password: randomPass
        };
        bcrypt.genSalt(dbconfig.saltIteration, (err, salt) => {
            bcrypt.hash(update.password, salt, (err, hash) => {
                if (err) {
                    return res.json({
                        success: false,
                        message: 'Password could not be updated',
                    });
                } else {
                    update.password = hash;
                    // Update User
                    User.findOneAndUpdate({ email: req.body.email }, update, (err, updatedUser) => {
                        if (err) {
                            console.log(err);
                            res.json({
                                success: false,
                                message: 'Password could not be updated'
                            });
                        } else if (updatedUser) {
                            // send forget password mail
                            var mailParams = {};
                            mailParams.email = updatedUser.email;
                            mailParams.subject = mailHelper.subject.resetPassword;
                            mailParams.firstName = updatedUser.firstName;
                            mailParams.newpass = randomPass;
                            mailHelper.sendMail('forgotPassword', mailParams, success, failure);

                            // success in sending mail to user
                            function success() {
                                console.log('forgot password : Success in sending mail');
                            }
                            // failure in sending mail to user
                            function failure() {
                                console.log('forgot password : Failure in sending mail');
                            }

                            return res.json({
                                success: true,
                                message: 'New password has been sent to your email address!',
                                user: updatedUser
                            });
                        } else {
                            return res.json({
                                success: false,
                                message: 'Email not found! Check your email once again!',
                            });
                        }
                    });
                }
            });
        });
    } else {
        return res.json({
            success: false,
            message: 'Email is required!',
        });
    }
}



function changePassword(req, res, next) {

    if (req.body.userId && req.body.password && req.body.currentPassword) {
        User.find({ _id: req.body.userId })
            .exec((err, _user) => {
                if (err) {
                    res.json({
                        success: false,
                        message: 'ERROR when retrieving user!'
                    });
                } else {
                    if (!_user) {
                        return res.json({
                            success: false,
                            message: 'No user found!'
                        });
                    } else {
                        let oldPassword = req.body.currentPassword;
                        let update = {
                            password: req.body.password,
                            isPasswordChanged: true,
                            lastPasswordUpdatedAt: new Date().getTime()
                        }
                        let compare = _user[0].comparePassword(oldPassword);
                        if (compare) {
                            bcrypt.genSalt(dbconfig.saltIteration, (err, salt) => {
                                bcrypt.hash(update.password, salt, (err, hash) => {
                                    if (err) {
                                        return res.json({
                                            success: false,
                                            message: 'Password could not be updated',
                                        });
                                    } else {
                                        let isMatchWithLastPasswords = false;
                                        if (_user[0].lastPasswords) {
                                            for (let i = 0; i < _user[0].lastPasswords.length; i++) {
                                                isMatchWithLastPasswords = (helpers.util.comparePassword(update.password, _user[0].lastPasswords[i])) ? true : isMatchWithLastPasswords;
                                            }
                                        }
                                        if (isMatchWithLastPasswords) {
                                            return res.json({
                                                success: false,
                                                message: `Password must not be same as your last ${appConfig.passwordHistoryLength} passwords`,
                                            });
                                        } else {
                                            update.password = hash;
                                            if (_user[0].lastPasswords.length === appConfig.passwordHistoryLength) {
                                                _user[0].lastPasswords.shift();
                                            }
                                            _user[0].lastPasswords.push(update.password);

                                            update['lastPasswords'] = _user[0].lastPasswords;
                                            User.findByIdAndUpdate(req.body.userId, update, (err, updatedUser) => {
                                                if (err) {
                                                    console.log(err);
                                                    res.json({
                                                        success: false,
                                                        message: 'Unable to update password! Try again'
                                                    });
                                                } else {
                                                    return res.json({
                                                        success: true,
                                                        message: 'Password Updated successfully!',
                                                        user: updatedUser
                                                    });
                                                }
                                            });
                                        }
                                    }
                                });
                            });
                        } else {
                            return res.json({
                                success: false,
                                message: 'Current password is not valid!'
                            });
                        }
                    }
                }
            });
    } else {
        return res.json({
            success: false,
            message: 'Current password and new password are required!',
        });
    }
}