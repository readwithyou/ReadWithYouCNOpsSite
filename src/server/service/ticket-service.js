var sprintf = require('sprintf-js').sprintf;
var moment = require('moment-timezone');

var generatorId = require('../service/generate-id');
var sendMail = require('./send-mail');
var mailTemplates = require('./mail-template');
var teacherDao = require('../dao/teacher-dao');
var userDao = require('../dao/user-dao');
var ticketsDao = require('../dao/tickets-dao');

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
        let timeOffset = 'UTC/GMT ' + startMoment.format('Z');

        if (endTime) {
            return startDay + '-' + endDay + '(' + displayTimezone + ' ' + timeOffset + ')';
        }
        else {
            return startDay + '(' + displayTimezone + ', ' + timeOffset + ')';
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
            subject: sprintf('%s will cancel the lesson on %s.', leaveRequest.studentName, timeString),
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

    var getNewTicketMailOption = function (ticket, userEmailMap) {
        let email = userEmailMap.get(ticket.createBy) + ',' + userEmailMap.get(ticket.assignTo);
        let subject = sprintf(mailTemplates.newTicketEmailTitle,
            ticket.ID, ticket.status, ticket.title);
        let content = sprintf(mailTemplates.ticketEmailContent,
            ticket.ID, ticket.assignTo, ticket.createBy,
            ticket.ID, ticket.title, ticket.content);

        return {
            to: email,
            cc: ticket.ccEmails,
            subject: subject,
            html: content,
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

    var getUpdateTicketMailOption = function (ticket, userEmailMap) {
        let email = userEmailMap.get(ticket.createBy) + ',' + userEmailMap.get(ticket.assignTo);
        let subject = sprintf(mailTemplates.updateTicketEmailTitle,
            ticket.ID, ticket.status, ticket.title);
        let content = sprintf(mailTemplates.ticketEmailContent,
            ticket.ID, ticket.assignTo, ticket.createBy,
            ticket.ID, ticket.title, ticket.content);

        return {
            to: email,
            cc: ticket.ccEmails,
            subject: subject,
            html: content,
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

    var getCorrespondenceMailOption = function (ticket, by, reply, userEmailMap) {
        let email = userEmailMap.get(by) + ',' + userEmailMap.get(ticket.createBy) + ',' + userEmailMap.get(ticket.assignTo);
        let subject = sprintf(mailTemplates.ticketCorrespondenceEmailTitle,
            ticket.ID, ticket.status, ticket.title);
        let content = sprintf(mailTemplates.ticketCorrespondenceEmailContent,
            by, reply, ticket.ID, ticket.title, ticket.content);

        return {
            to: email,
            cc: ticket.ccEmails,
            subject: subject,
            html: content,
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

    function appendCorrespondence(ticket, username, reply) {
        if (!ticket.correspondence) {
            ticket.correspondence = [];
        }
        let newReply = {
            by: username,
            time: new Date().getTime(),
            content: reply
        }
        ticket.correspondence.push(newReply);
        return ticketsDao.updateAsync(ticket);
    }


    function buildUserEmailMap() {
        return userDao.scanAsync().then(
            (data) => {
                var myMap = new Map();
                data.Items.forEach(
                    u => myMap.set(u.username, u.email)
                );
                return myMap;
            },
            (err) => console.log('DDB Error: ' + err)
        )
    }

    function leaveMailAsync(leaveRequest) {
        return teacherDao.getAsync(leaveRequest.teacherId)
            .then(
                (data) => sendMail.sendAsync(getTeacherLeaveMailOption(data.Item, leaveRequest)),
                (err) => console.log('DDB Error: ' + err)
            );
    }

    function getTicket(id) {
        return ticketsDao.getAsync(id);
    }

    function getAllTickets() {
        return ticketsDao.scanAsync();
    }

    function createTicket(ticket, username) {
        ticket.ID = generatorId();
        ticket.createTime = new Date().getTime();
        ticket.createBy = username;
        ticket.status = 'OPEN';

        return ticketsDao.createAsync(ticket).then(
            () => buildUserEmailMap(),
            (err) => console.log('DDB Error: ' + err)
        ).then(
            (userEmailMap) => sendMail.sendAsync(getNewTicketMailOption(ticket, userEmailMap)),
            (err) => console.log('DDB Error: ' + err)
        );
    }

    function updateTicket(ticket, username) {
        ticket.modifyTime = new Date().getTime();
        ticket.modifyBy = username;

        return ticketsDao.updateAsync(ticket).then(
            () => buildUserEmailMap(),
            (err) => console.log('DDB Error: ' + err)
        ).then(
            (userEmailMap) => sendMail.sendAsync(getUpdateTicketMailOption(ticket, userEmailMap)),
            (err) => console.log('DDB Error: ' + err)
        ).then(
            () => ticketsDao.getAsync(ticket.ID),
            (err) => console.log('DDB Error: ' + err)
        );
    }

    function newCorrespondence(id, username, reply) {
        var ticket;
        return ticketsDao.getAsync(id).then(
            (data) => { ticket = data.Item; appendCorrespondence(ticket, username, reply); },
            (err) => console.log('DDB Error: ' + err)
        ).then(
            () => buildUserEmailMap(),
            (err) => console.log('DDB Error: ' + err)
        ).then(
            (userEmailMap) => sendMail.sendAsync(getCorrespondenceMailOption(ticket, username, reply, userEmailMap)),
            (err) => console.log('DDB Error: ' + err)
        ).then(
            () => ticketsDao.getAsync(id),
            (err) => console.log('DDB Error: ' + err)
        );
    }

    return {
        leaveMailAsync,
        createTicket,
        getTicket,
        getAllTickets,
        updateTicket,
        newCorrespondence,
    };
}();

module.exports = ticketService;