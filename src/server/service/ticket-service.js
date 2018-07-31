var sprintf = require('sprintf-js').sprintf;
var moment = require('moment-timezone');

var generatorId = require('../service/generate-id');
var sendMail = require('./send-mail');
var mailTemplates = require('./mail-template');
var teacherDao = require('../dao/teacher-dao');
var userDao = require('../dao/user-dao');
var ticketsDao = require('../dao/tickets-dao');
var timezoneUtils = require('../utils/timezone-utils');

var ticketService = function () {
    moment.fn.zoneName = function () {
        var abbr = this.zoneAbbr();
        return timezoneUtils.getAbbrs()[abbr] || abbr;
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

    var sendTeacherLeaveMailAsync = function (teacher, leaveRequest) {
        let email = teacher.email;
        let name = teacher.name;
        let timezone = teacher.timezone;

        // setup email data with unicode symbols
        let timeString = formatTimeString(leaveRequest.startLeaveTime, leaveRequest.endLeaveTime, 'en-US', timezone);
        let mailSubject = sprintf('%s will cancel the lesson on %s.', leaveRequest.studentName, timeString);
        let mailContent = sprintf(mailTemplates.teacherLeaveEmail, name, leaveRequest.studentName, timeString);

        return sendMail.sendWithParamsAsync(email, 'lessons@readwithyou.com', mailSubject, mailContent, true);
    }

    var sendNewTicketMailAsync = function (ticket, userEmailMap) {
        let email = Array.from(new Set([userEmailMap.get(ticket.createBy), userEmailMap.get(ticket.assignTo)])).join();
        let subject = sprintf(mailTemplates.newTicketEmailTitle,
            ticket.ID, ticket.status, ticket.title);
        let content = sprintf(mailTemplates.newTicketEmailContent,
            ticket.ID, ticket.assignTo, ticket.createBy,
            ticket.ID, ticket.title, ticket.content);

        return sendMail.sendWithParamsAsync(email, ticket.ccEmails, subject, content, false);
    }

    var sendContentUpdateTicketMailAsync = function (ticket, userEmailMap) {
        let email = Array.from(new Set([userEmailMap.get(ticket.createBy), userEmailMap.get(ticket.assignTo)])).join();
        let subject = sprintf(mailTemplates.contentUpdateTicketEmailTitle,
            ticket.ID, ticket.status, ticket.title);
        let content = sprintf(mailTemplates.contentUpdateTicketEmailContent,
            ticket.ID, ticket.modifyBy,
            ticket.ID, ticket.title, ticket.content);

        return sendMail.sendWithParamsAsync(email, ticket.ccEmails, subject, content, false);
    }

    var sendStatusUpdateTicketMailAsync = function (ticket, previousStatus, userEmailMap) {
        let email = Array.from(new Set([userEmailMap.get(ticket.createBy), userEmailMap.get(ticket.assignTo)])).join();
        let subject = sprintf(mailTemplates.statusUpdateTicketEmailTitle,
            ticket.ID, previousStatus, ticket.status, ticket.title);
        let content = sprintf(mailTemplates.statusUpdateTicketEmailContent,
            ticket.ID, previousStatus, ticket.status, ticket.modifyBy,
            ticket.ID, ticket.title, ticket.content);

        return sendMail.sendWithParamsAsync(email, ticket.ccEmails, subject, content, false);
    }

    var sendAssignmentUpdateTicketMailAsync = function (ticket, userEmailMap) {
        let email = Array.from(new Set([userEmailMap.get(ticket.createBy), userEmailMap.get(ticket.assignTo)])).join();
        let subject = sprintf(mailTemplates.assignmentUpdateTicketEmailTitle,
            ticket.ID, ticket.assignTo, ticket.title);
        let content = sprintf(mailTemplates.assignmentUpdateTicketEmailContent,
            ticket.ID, ticket.assignTo, ticket.modifyBy,
            ticket.ID, ticket.title, ticket.content);

        return sendMail.sendWithParamsAsync(email, ticket.ccEmails, subject, content, false);
    }

    var sendCorrespondenceMailAsync = function (ticket, by, reply, userEmailMap) {
        let email = Array.from(new Set([userEmailMap.get(by), userEmailMap.get(ticket.createBy), userEmailMap.get(ticket.assignTo)])).join();
        let subject = sprintf(mailTemplates.ticketCorrespondenceEmailTitle,
            ticket.ID, ticket.status, ticket.title);
        let content = sprintf(mailTemplates.ticketCorrespondenceEmailContent,
            by, reply, ticket.ID, ticket.title, ticket.content);

        return sendMail.sendWithParamsAsync(email, ticket.ccEmails, subject, content, false);
    }

    var sendUpdateTicketMailAsync = function (preTicket, ticket, userEmailMap) {
        if (preTicket.assignTo === ticket.assignTo && preTicket.status === ticket.status)
            return sendContentUpdateTicketMailAsync(ticket, userEmailMap);
        else if (preTicket.status === ticket.status)
            return sendAssignmentUpdateTicketMailAsync(ticket, userEmailMap);
        else
            return sendStatusUpdateTicketMailAsync(ticket, preTicket.status, userEmailMap);
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

        ticket.modifyTime = new Date().getTime();
        ticket.modifyBy = username;

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
                (data) => sendTeacherLeaveMailAsync(data.Item, leaveRequest),
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
        ticket.modifyTime = new Date().getTime();
        ticket.modifyBy = username;
        ticket.status = 'OPEN';

        return ticketsDao.createAsync(ticket).then(
            () => buildUserEmailMap(),
            (err) => console.log('DDB Error: ' + err)
        ).then(
            (userEmailMap) => sendNewTicketMailAsync(ticket, userEmailMap),
            (err) => console.log('DDB Error: ' + err)
        );
    }

    function updateTicket(ticket, username) {
        ticket.modifyTime = new Date().getTime();
        ticket.modifyBy = username;

        var preTicket = ticket;

        return ticketsDao.getAsync(ticket.ID).then(
            (data) => {
                preTicket = data.Item;
                return ticketsDao.updateAsync(ticket);
            },
            (err) => console.log('DDB Error: ' + err)
        ).then(
            () => buildUserEmailMap(),
            (err) => console.log('DDB Error: ' + err)
        ).then(
            (userEmailMap) => sendUpdateTicketMailAsync(preTicket, ticket, userEmailMap),
            (err) => console.log('DDB Error: ' + err)
        ).then(
            () => ticketsDao.getAsync(ticket.ID),
            (err) => console.log('Mail Error: ' + err)
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
            (userEmailMap) => sendCorrespondenceMailAsync(ticket, username, reply, userEmailMap),
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