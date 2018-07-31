'use strict';

const nodemailer = require('nodemailer');
var mailTemplates = require('./mail-template');
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

    var sendWithParamsAsync = function (to, cc, subject, content, signature) {
        var option = {
            to: to,
            cc: cc,
            subject: subject,
            html: content.replace(/(?:\r\n|\r|\n)/g, '<br />')
        };

        if (signature) {
            option.attachments = [
                {
                    filename: 'signature.png',
                    content: mailTemplates.encodedSignatureImg.split("base64,")[1],
                    encoding: 'base64',
                    cid: 'unique@kreata.ee'
                }
            ];
        }

        return sendAsync(option);
    };

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
        sendAsync,
        sendWithParamsAsync
    };
}();

module.exports = sendMail;