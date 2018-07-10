var sprintf = require('sprintf-js').sprintf;
var moment = require('moment-timezone');
var ical = require('ical-generator');

var sendMail = require('./send-mail');
var mailTemplates = require('./mail-template');
var registrationDao = require('../dao/reg-dao');
var teacherDao = require('../dao/teacher-dao');
var s3Accessor = require('../dao/s3-accessor');

var regService = function () {
    var abbrs = {
        EST: 'Eastern Standard Time',
        EDT: 'Eastern Daylight Time',
        CST: 'Central Standard Time',
        CDT: 'Central Daylight Time',
        MST: 'Mountain Standard Time',
        MDT: 'Mountain Daylight Time',
        PST: 'Pacific Standard Time',
        PDT: 'Pacific Daylight Time',
        JST: 'Japan Standard Time'
    };

    moment.fn.zoneName = function () {
        var abbr = this.zoneAbbr();
        return abbrs[abbr] || abbr;
    };

    var formatTimeString = function (scheduledTime, locale, timezone) {
        moment.locale(locale);
        let startMoment = moment(scheduledTime).tz(timezone);
        let scheduledDay = startMoment.format('LL');
        let scheduledDayOfWeek = startMoment.format('dddd');
        let scheduledAmPm = startMoment.format('A');
        let scheduledStartTime = startMoment.format('HH:mm');
        let endMoment = moment(scheduledTime + 2700000).tz(timezone);
        let scheduledEndTime = endMoment.format('HH:mm');
        let displayTimezone = startMoment.format('z') + ', ' + startMoment.format('zz');
        if (timezone === 'Asia/Shanghai') {
            //CST is also abbr for China Standard Time. It is a conflict with American CST
            displayTimezone = 'China Standard Time';
        }

        if (locale == 'zh-CN') {
            return scheduledDay
                + '(' + scheduledDayOfWeek + scheduledAmPm + ') '
                + scheduledStartTime + '-' + scheduledEndTime;
        } else {
            return scheduledDay
                + '(' + scheduledDayOfWeek + ') '
                + scheduledStartTime + '-' + scheduledEndTime
                + scheduledAmPm + '(' + displayTimezone + ') ';
        }
    };

    var getStudentScheduleMailOption = function (registration) {
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

    var getStudentReportMailOptionAsync = function (registration) {
        let email = registration.email;
        let name = registration.enName ? registration.enName : registration.cnName;

        // setup email data with unicode symbols
        let mailContent = sprintf(mailTemplates.studentReportEmail, name);

        let mailOptions = {
            to: email,
            cc: 'lessons@readwithyou.com',
            subject: sprintf('%s 陪你读书试课报告', name),
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
        if (!registration.courseResultFiles) registration.courseResultFiles = [];

        registration.courseResultFiles.forEach(f => {
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

    var getTeacherScheduleMailOptionAsync = function (registration, teacher) {
        let studentName = registration.enName ? registration.enName : registration.cnName;
        let age = registration.age;
        let gender = registration.gender;
        let zoomId = registration.zoomLink;
        let courseRemarks = registration.courseRemarks;

        let email = teacher.email;
        let name = teacher.name;
        let timezone = teacher.timezone;
        let scheduledTimeString = formatTimeString(registration.scheduledTime, 'en-US', timezone);

        let mailSubject = sprintf('Trial email notice for %s', registration.enName);
        // setup email data with unicode symbols
        let mailContent = sprintf(mailTemplates.teacherSchedulingEmail,
            name, studentName, age, gender, courseRemarks,
            scheduledTimeString, zoomId, zoomId);

        let icalContent = ical({
            domain: 'readwithyou.cn',
            events: [{
                start: new Date(registration.scheduledTime),
                end: new Date(registration.scheduledTime + 2700000),
                summary: mailSubject,
                description: mailSubject,
                organizer: {
                    name: 'Read With You Ops Team',
                    email: 'lessons@readwithyou.com'
                },
                method: 'request'
            }]
        }).toString();

        let mailOptions = {
            to: email,
            cc: 'lessons@readwithyou.com',
            subject: mailSubject,
            icalEvent: {
                method: 'request',
                content: icalContent
            },
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

    var getTeacherReportMailOption = function (registration, teacher) {
        let studentName = registration.enName ? registration.enName : registration.cnName;
        let resultRemarks = registration.resultRemarks;
        let email = teacher.email;
        let name = teacher.name;

        // setup email data with unicode symbols
        let mailContent = sprintf(mailTemplates.teacherReportEmail,
            name, studentName, resultRemarks);

        return {
            to: email,
            cc: 'lessons@readwithyou.com',
            subject: sprintf('Trial Report Feedback for %s', studentName),
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

    var getNewRegMailOption = function (registration) {
        let studentName = registration.cnName;
        if (registration.type === 'child') {
            studentName += '（家长：' + registration.parentName + '）';
        }

        // setup email data with unicode symbols
        let mailContent = sprintf(mailTemplates.newRegistrationMail, studentName);
        return {
            to: 'lessons@readwithyou.com',
            subject: sprintf('[系统邮件]试课报名通知：%s', studentName),
            html: mailContent
        };
    }

    function mailScheduleToStudentAsync(registrationId) {
        return registrationDao.getAsync(registrationId)
            .then(
                (data) => sendMail.sendAsync(getStudentScheduleMailOption(data.Item)),
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
                (data) => { teacher = data.Item; return getTeacherScheduleMailOptionAsync(registration, teacher); },
                (err) => console.log('DDB Error: ' + err)
            )
            .then(
                (data) => sendMail.sendAsync(data),
                (err) => { console.log('Get Mail Option Error: ' + err); }
            );
    }

    function mailReportToStudentAsync(registrationId) {
        return registrationDao.getAsync(registrationId)
            .then(
                (data) => getStudentReportMailOptionAsync(data.Item),
                (err) => console.log('DDB Error: ' + err)
            )
            .then(
                (data) => sendMail.sendAsync(data),
                (err) => console.log('Get Mail Option Error: ' + err)
            );
    }

    function mailReportToTeacherAsync(registrationId) {
        var registration;
        return registrationDao.getAsync(registrationId)
            .then(
                (data) => { registration = data.Item; return teacherDao.getAsync(registration.teacherId); },
                (err) => console.log('DDB Error: ' + err)
            )
            .then(
                (data) => sendMail.sendAsync(getTeacherReportMailOption(registration, data.Item)),
                (err) => console.log('DDB Error: ' + err)
            );
    }

    function mailNewRegistrationAsync(registrationId) {
        return registrationDao.getAsync(registrationId)
            .then(
                (data) => sendMail.sendAsync(getNewRegMailOption(data.Item)),
                (err) => console.log('DDB Error: ' + err)
            );
    }

    return {
        mailScheduleToStudentAsync: mailScheduleToStudentAsync,
        mailScheduleToTeacherAsync: mailScheduleToTeacherAsync,
        mailReportToStudentAsync: mailReportToStudentAsync,
        mailReportToTeacherAsync: mailReportToTeacherAsync,
        mailNewRegistrationAsync: mailNewRegistrationAsync
    };
}();

module.exports = regService;