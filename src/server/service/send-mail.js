'use strict';
const nodemailer = require('nodemailer');
var config = require('../config');

var sendMail = function () {
    let transporter = nodemailer.createTransport({
        pool: true,
        host: 'smtp.zoho.com',
        port: 465,
        secure: true, // use TLS
        auth: {
            user: config.emailAccount,
            pass: config.emailKey
        }
    });

    var sendAsync = function (mailOptions) {
        return new Promise(function (resolve, reject) {
            mailOptions.from = config.emailAccount;
            transporter.sendMail(mailOptions, (error) => {
                if (error) {
                    reject(err);
                }
                resolve();
            });
        })
    };
    return {
        sendAsync: sendAsync
    };
}();

module.exports = sendMail;