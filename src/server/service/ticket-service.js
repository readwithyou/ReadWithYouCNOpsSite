var sprintf = require('sprintf-js').sprintf;
var moment = require('moment-timezone');

var sendMail = require('./send-mail');
var mailTemplates = require('./mail-template');
var teacherDao = require('../dao/teacher-dao');

var ticketService = function () {
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

    var formatTimeString = function (startTime, endTime, locale, timezone) {
        moment.locale(locale);
        let startMoment = moment(startTime).tz(timezone);
        let startDay = startMoment.format('LL');

        let endMoment = moment(endTime).tz(timezone);
        let endDay = endMoment.format('LL');

        let displayTimezone = startMoment.format('z') + ', ' + startMoment.format('zz');

        if (timezone === 'Asia/Shanghai') {
            //CST is also abbr for China Standard Time. It is a conflict with American CST
            displayTimezone = 'China Standard Time';
        }

        if (endTime) {
            return startDay + '-' + endDay + '(' + displayTimezone + ') ';
        }
        else {
            return startDay + '(' + displayTimezone + ') ';
        }
    };

    var getTeacherLeaveMailOption = function (teacher, leaveRequest) {
        let email = teacher.email;
        let name = teacher.name;
        let timezone = teacher.timezone;

        // setup email data with unicode symbols
        let timeString = formatTimeString(leaveRequest.startLeaveTime, leaveRequest.endLeaveTime, 'en-US', timezone);
        let mailContent = sprintf(mailTemplates.teacherLeaveEmail, name, leaveRequest.studentName, timeString);

        return {
            to: email,
            cc: 'lessons@readwithyou.com',
            subject: sprintf('%s will cancel his/her lesson on %s.', leaveRequest.studentName, timeString),
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

    function leaveMailAsync(leaveRequest) {
        return teacherDao.getAsync(leaveRequest.teacherId)
            .then(
                (data) => sendMail.sendAsync(getTeacherLeaveMailOption(data.Item, leaveRequest)),
                (err) => console.log('DDB Error: ' + err)
            );
    }

    return {
        leaveMailAsync: leaveMailAsync
    };
}();

module.exports = ticketService;