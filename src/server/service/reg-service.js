var sprintf = require('sprintf-js').sprintf;
var moment = require('moment-timezone');

var sendMail = require('./send-mail');
var mailTemplates = require('./mail-template');
var registrationDao = require('../dao/reg-dao');
var teacherDao = require('../dao/teacher-dao');
var s3Accessor = require('../dao/s3-accessor');

var regService = function () {
    var formatTimeString = function (scheduledTime, locale, timezone) {
        moment.locale(locale);
        let startMoment = moment(scheduledTime).tz(timezone);
        let scheduledDay = startMoment.format('LL');
        let scheduledDayOfWeek = startMoment.format('dddd');
        let scheduledAmPm = startMoment.format('A');
        let scheduledStartTime = startMoment.format('HH:mm');
        let endMoment = moment(scheduledTime + 2700000).tz(timezone);
        let scheduledEndTime = endMoment.format('HH:mm');

        if (locale == 'zh-CN') {
            return scheduledDay
                + '(' + scheduledDayOfWeek + scheduledAmPm + ') '
                + scheduledStartTime + '-' + scheduledEndTime;
        } else {
            return scheduledDay
                + '(' + scheduledDayOfWeek + ') '
                + scheduledStartTime + '-' + scheduledEndTime
                + scheduledAmPm + '(' + timezone + ') ';
        }
    };

    var getStudentMailOption = function (registration) {
        let email = registration.email;
        let name = registration.enName ? registration.enName : registration.cnName;
        let zoomId = registration.zoomLink;
        let scheduledTimeString = formatTimeString(registration.scheduledTime, 'zh-CN', 'Asia/Shanghai');

        // setup email data with unicode symbols
        let mailContent = sprintf(mailTemplates.childSchedulingEmail, name, name, scheduledTimeString, zoomId, zoomId, zoomId);
        if (registration.type === 'adult') {
            mailContent = sprintf(mailTemplates.adultSchedulingEmail, name, scheduledTimeString, zoomId, zoomId, zoomId);
        }

        return {
            to: email,
            cc: 'lessons@readwithyou.com',
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
    }

    var getTeacherMailOptionAsync = function (registration, teacher) {
        let studentName = registration.enName ? registration.enName : registration.cnName;
        let age = registration.age;
        let gender = registration.gender;
        let zoomId = registration.zoomLink;
        let courseRemarks = registration.courseRemarks;

        let email = teacher.email;
        let name = teacher.name;
        let timezone = teacher.timezone;
        let scheduledTimeString = formatTimeString(registration.scheduledTime, 'en-US', timezone);

        // setup email data with unicode symbols
        let mailContent = sprintf(mailTemplates.teacherSchedulingEmail,
            name, studentName, age, gender, courseRemarks,
            scheduledTimeString, zoomId, zoomId);

        let mailOptions = {
            to: email,
            cc: 'lessons@readwithyou.com',
            subject: sprintf('Trial email notice for %s', registration.enName),
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

        let filePreSignedUrlPromises = [];
        if (!registration.courseFiles) registration.courseFiles = [];

        registration.courseFiles.forEach(f => {
            filePreSignedUrlPromises.push(s3Accessor.getGetSignedUrlAsync(f));
        });

        return Promise.all(filePreSignedUrlPromises).then(
            (results) => {
                results.forEach(r =>
                    mailOptions.attachments.push(
                        {
                            filename: r.filePath,
                            path: r.url
                        }));
                return mailOptions;
            },
            (err) => console.log('S3 accessor Error: ' + err)
        );
    }

    function mailScheduleToStudentAsync(registrationId) {
        return registrationDao.getAsync(registrationId)
            .then(
                (data) => sendMail.sendAsync(getStudentMailOption(data.Item)),
                (err) => console.log('DDB Error: ' + err)
            );
    }

    function mailScheduleToTeacherAsync(registrationId) {
        var registration, teacher;
        return registrationDao.getAsync(registrationId)
            .then(
                (data) => { registration = data.Item; return teacherDao.getAsync(registration.teacherId); },
                (err) => console.log('DDB Error: ' + err)
            )
            .then(
                (data) => { teacher = data.Item; return getTeacherMailOptionAsync(registration, teacher); },
                (err) => console.log('DDB Error: ' + err)
            )
            .then(
                (data) => sendMail.sendAsync(data),
                (err) => { console.log('Get Mail Option Error: ' + err); }
            );
    }

    return {
        mailScheduleToStudentAsync: mailScheduleToStudentAsync,
        mailScheduleToTeacherAsync: mailScheduleToTeacherAsync
    };
}();

module.exports = regService;