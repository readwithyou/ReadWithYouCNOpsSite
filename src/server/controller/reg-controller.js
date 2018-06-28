var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var sprintf = require('sprintf-js').sprintf;
var moment = require('moment-timezone');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

var verifyToken = require('./verify-token');
var generatorId = require('./generate-id');
var sendMail = require('./send-mail');
var mailTemplates = require('./mail-template');
var registrationDao = require('../dao/reg-dao');
var s3Accessor = require('../dao/s3-accessor');

router.get('/:id', verifyToken, function (req, res, next) {
    registrationDao.get(req.params.id, function (err, data) {
        if (err) {
            console.log('DDB Error: ' + err);
            var returnStatus = 500;
            res.status(returnStatus).end();
        } else {
            res.json(data.Item);
        }
    });
});

router.get('/', verifyToken, function (req, res, next) {
    registrationDao.scan(function (err, data) {
        if (err) {
            var returnStatus = 500;
            res.status(returnStatus).end();
        } else {
            res.json(data.Items);
        }
    });
});

router.post('/', verifyToken, function (req, res, next) {
    var item = req.body;
    item.ID = generatorId();
    item.createTime = new Date().toISOString();

    registrationDao.create(item, function (err, data) {
        var returnStatus = 200;
        if (err) {
            console.log('DDB Error: ' + err);
            var returnStatus = 500;
        }
        res.status(returnStatus).end();
    });
});

router.post('/:id/schedule', verifyToken, function (req, res, next) {
    var item = req.body;
    item.status = 1;
    registrationDao.update(req.params.id, item, function (err, data) {
        var returnStatus = 200;
        if (err) {
            console.log('DDB Error: ' + err);
            var returnStatus = 500;
        }
        res.status(returnStatus).end();
    });
});

router.delete('/:id', verifyToken, function (req, res, next) {
    registrationDao.remove(req.params.id, function (err, data) {
        var returnStatus = 200;
        if (err) {
            console.log('DDB Error: ' + err);
            var returnStatus = 500;
        }
        res.status(returnStatus).end();
    });
});

router.post('/upload-url', verifyToken, function (req, res, next) {
    var item = req.body;
    s3Accessor.getPutSignedUrl(item.filePath, item.contentType, function (err, url) {
        if (err) {
            console.log('S3 accessor Error: ' + err);
            res.status(500).end();
        } else {
            res.json({ url: url });
        }
    });
});

router.post('/download-url', verifyToken, function (req, res, next) {
    var item = req.body;

    s3Accessor.getGetSignedUrl(item.filePath, function (err, url) {
        if (err) {
            console.log('S3 accessor Error: ' + err);
            res.status(500).end();
        } else {
            res.json({ url: url });
        }
    });
});

router.post('/:id/student-scheduling-mail', verifyToken, function (req, res, next) {
    registrationDao.get(req.params.id, function (err, data) {
        if (err) {
            console.log('DDB Error: ' + err);
            var returnStatus = 500;
            res.status(returnStatus).end();
        } else {
            let email = data.Item.email;
            let name = data.Item.enName ? data.Item.enName : data.Item.ecnName;
            let zoomId = data.Item.zoomLink;

            moment.locale('zh-CN');
            let scheduledTime = data.Item.scheduledTime;
            let startMoment = moment(scheduledTime).tz('Asia/Shanghai');
            let scheduledDay = startMoment.format('LL');
            let scheduledDayOfWeek = startMoment.format('dddd');
            let scheduledAmPm = startMoment.format('A');
            let scheduledStartTime = startMoment.format('HH:mm');
            let endMoment = moment(scheduledTime + 2700000).tz('Asia/Shanghai');
            let scheduledEndTime = endMoment.format('HH:mm');
            let scheduledTimeString = scheduledDay + '(' + scheduledDayOfWeek + scheduledAmPm + ') ' + scheduledStartTime + '-' + scheduledEndTime;

            // setup email data with unicode symbols
            let mailContent = sprintf(mailTemplates.childSchedulingEmail, name, name, scheduledTimeString, zoomId, zoomId, zoomId);
            if (data.Item.type === 'adult') {
                mailContent = sprintf(mailTemplates.adultSchedulingEmail, name, scheduledTimeString, zoomId, zoomId, zoomId);
            }

            let mailOptions = {
                to: email,
                subject: sprintf('%s 陪你读书试课通知', name),
                html: mailContent,
                attachments: [
                    {
                        filename: 'signature.png',
                        content: mailTemplates.encodedSignatureImg.split("base64,")[1],
                        encoding: 'base64',
                        cid: 'unique@kreata.ee'
                    }
                ]
            };

            sendMail.send(mailOptions, (error, info) => {
                if (error) {
                    console.log('Mail Send Error: ' + err);
                    res.status(500).end();
                }
                res.status(200).end();
            });
        }
    });
});

module.exports = router;