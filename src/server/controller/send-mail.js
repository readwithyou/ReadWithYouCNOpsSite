'use strict';
const nodemailer = require('nodemailer');
var config = require('../config'); // get our config file

var sender = function () {
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

    var send = function (mailOptions, callback) {
        mailOptions.from = config.emailAccount;
        // send mail with defined transport object
        transporter.sendMail(mailOptions, callback);
    };

    return {
        send: send
    };
}();

module.exports = sender;