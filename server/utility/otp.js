const appConfig = require('../../config/appConfig');
const dbconfig = require('../../config/dbConfig');
const config = require('../config/config').get(process.env.NODE_ENV);
const mailHelper = require('./mail');
const mongoose = require('mongoose');
const OtpCollection = require('../sb_models/shared/otp');
var UserCollection = require('../sb_models/userData/user');
const otpGenerator = require('otp-generator');


module.exports = {
    sendOTPEmail: sendOTPEmail,
    generateAndSendOTP: generateAndSendOTP,
    deleteOTP: deleteOTP,
    generateOTP: generateOTP,
    isOTPExpired: isOTPExpired
};

/**
 * 
 * @param {*} otpGeneratedTime : OTP generated Time in milliseconds
 */
function isOTPExpired(otpGeneratedTime) {
    return ((new Date().getTime() - otpGeneratedTime) > appConfig.otpExpirationTime) ? true : false;
}

/**
 * Generate OTP, Save OTP to DB and Send OTP email to user
 * @param {*} userRefId User Reference Id
 */
async function generateAndSendOTP(userRefId) {
    let otpFunction = async (resolve, reject) => {
        let user = await UserCollection.findById(userRefId).exec();
        if (user && user._id) {
            let otp = generateOTP();
            let dummyOtp = generateOTP();
            let otpObject = new OtpCollection({
                otp: otp,
                dummyOtp: dummyOtp,
                userRefId: userRefId,
                isExpired: false,
                isDeleted: false,
                generatedAt: new Date().getTime()
            });
            let savedOtp = await otpObject.save();
            if (savedOtp && savedOtp._id) {
                resolve(otpObject);
                let isMailSent = await sendOTPEmail(otp, user);
                // let isMailSent = true;
                if (isMailSent) {
                    setTimeout(() => {
                        deleteOTP(otpObject._id);
                    }, appConfig.otpExpirationTime);
                } else {
                    reject(false);
                }
            } else {
                reject(false);
            }
        } else {
            reject(false);
        }
    }
    let promise = new Promise(otpFunction);
    return promise;
}

async function deleteOTP(otpRef) {
    return OtpCollection.findByIdAndRemove(otpRef).exec();
}

/**
 * Generate OTP
 */
function generateOTP() {
    return otpGenerator.generate(6, {
        digits: true,
        alphabets: false,
        upperCase: false,
        specialChars: false
    });
}

/**
 * Send OTP mail to user
 * @param {*} otp 
 * @param {*} user 
 */
async function sendOTPEmail(otp, user) {
    let mailParams = {};
    mailParams.email = user.email;
    mailParams.subject = mailHelper.subject.otp;
    mailParams.firstName = user.firstName;
    mailParams.portalLink = (process.env.NODE_ENV === 'production') ? `https://${config.specific.environment.host}` : `http://${config.specific.environment.host}`;
    mailParams.otp = otp;
    let isSuccess = false;
    sendMailFunction = async (resolve, reject) => {
        await mailHelper.sendMail('otp', mailParams, () => {
            resolve(true);
        }, () => { reject(false) });
    }
    let promise = new Promise(sendMailFunction);
    return promise;
}