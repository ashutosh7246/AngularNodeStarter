/**
 * Utitlity for sending mail
 */
var path = require('path');
var templatesDir = path.resolve(__dirname, '../..', 'server/views/mail-templates');
var Email = require('email-templates');
var success = require('./success.js');
const sendmail = require('sendmail')();
let ejs = require('ejs');
let fs = require('fs');
var config = require("../config/config.js").get(process.env.NODE_ENV);

module.exports = {
    subject: {
        resetPassword: 'REACT NODE DEMO : Your password has been updated',
        resetPasswordOnMultipleLogin: 'REACT NODE DEMO: Password reset due to multiple unsuccessful login attempts',
        forgotPassword: 'REACT NODE DEMO : Your password has been updated',
        otp: 'REACT NODE DEMO : OTP Authentication',
        registration: 'REACT NODE DEMO : Password Changed',
        welcomeUser: 'REACT NODE DEMO : Registration complete'
    },
    sendMail: sendMail
};

/**
 * Send Mail
 * @param  {String} templateName Name of template which will be sent in the body of the mail
 * @param  {object} params       Includes mail's sender email-id, and dynamic parameters for body
 * @param  {cb}     success      Callback function for success
 * @param  {cb}     failure      Call back function for failure
 */
function sendMail(templateName, params, success, failure) {
    console.log('Sending mail to: ', params.email);
    params['contactEmail'] = 'notification@reactdemo.com';
    params['logoUrl'] = ((process.env.SECURE) ? 'https://' : 'http://' ) + `${config.specific.environment.host}/assets/img/logo.png`;
    if (process.env.SECURE) {
        sendByMailServer(templateName, params, success, failure);
    } else {
        sendByNodemailer(templateName, params, success, failure);
    }
}

function sendByNodemailer(templateName, params, success, failure) {
    let mailOptions = {
        to: params.email,
        from: 'ashutosh.shukla@aspiresoftware.in',
        subject: params.subject
    };
    let transportOptions = {
        service: 'Gmail',
        auth: {
            user: 'ashutosh.shukla@aspiresoftware.in',
            pass: 'vivla@uno'
        }
    };
    let viewOptions = {
        root: templatesDir,
        options: {
            extension: 'ejs'
        }
    };

    const email = new Email({
        message: mailOptions,
        views: viewOptions,
        send: true, // <--- uncomment to send mail in development/test mode
        transport: transportOptions
    });

    // Send Email
    return email.send({
        template: templateName,
        locals: params
    }).then(res => {
        console.log('Mail sent successfully!');
        success();
    }).catch(err => {
        console.log('Mail Sedn Error:', err);
        failure();
    });
}

// checkMail('otp', { email: 'ashutosh.shukla@aspiresoftware.in', subject: 'test template', firstName: 'ashutosh', otp: '202020' }, () => { }, () => { });
function sendByMailServer(templateName, params, success, failure) {
    let rawTemplate = fs.readFileSync(path.join(__dirname, `../views/mail-templates/${templateName}/html.ejs`), { encoding: 'utf8' });
    let html = ejs.render(rawTemplate, params);
    sendmail({
        from: 'notifications@reactdemo.com',
        to: params.email,
        subject: params.subject,
        html: html,
    }, (err, res) => {
        if (err) {
            console.log('Mail Send Error:', err);
            failure();
        } else {
            console.log('Mail sent successfully!');
            success();
        }
    });
}
