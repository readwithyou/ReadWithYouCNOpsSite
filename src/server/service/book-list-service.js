var sprintf = require('sprintf-js').sprintf;
var bookListDao = require('../dao/book-list-dao');
var inventoryDao = require('../dao/inventory-dao');
var userDao = require('../dao/user-dao');
var sendMail = require('./send-mail');
var mailTemplates = require('./mail-template');
var generatorId = require('../service/generate-id');

var bookListService = function () {
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

    var getMailList = function (bookList, username, userEmailMap) {
        let creatorEmail = userEmailMap.get(bookList.createBy);
        let actorEmail = userEmailMap.get(username);
        let supervisorEmail = userEmailMap.get('Amelia');

        return Array.from(new Set([creatorEmail, actorEmail, supervisorEmail])).join();
    }

    var getCreateMailParams = function (bookList, username, userEmailMap) {
        return {
            email: getMailList(bookList, username, userEmailMap),
            subject: sprintf(mailTemplates.booklistCreateEmailTitle,
                bookList.name, bookList.createBy, bookList.studentName),
            content: sprintf(mailTemplates.booklistCreateEmailContent,
                bookList.name, bookList.createBy, bookList.studentName, bookList.studentId, bookList.ID)
        };

    }

    var getApprovalMailParams = function (bookList, username, comments, userEmailMap) {
        return {
            email: getMailList(bookList, username, userEmailMap),
            subject: sprintf(mailTemplates.booklistApproveEmailTitle,
                bookList.name, bookList.createBy, bookList.studentName),
            content: sprintf(mailTemplates.booklistApproveEmailContent,
                bookList.name, bookList.createBy, bookList.studentName, comments, bookList.studentId, bookList.ID)
        }
    }

    var getRejectMailParams = function (bookList, username, comments, userEmailMap) {
        return {
            email: getMailList(bookList, username, userEmailMap),
            subject: sprintf(mailTemplates.booklistRejectEmailTitle,
                bookList.name, bookList.createBy, bookList.studentName),
            content: sprintf(mailTemplates.booklistRejectEmailContent,
                bookList.name, bookList.createBy, bookList.studentName, comments, bookList.studentId, bookList.ID)
        }
    }

    var getDeliverdMailParams = function (bookList, username, comments, userEmailMap) {
        return {
            email: getMailList(bookList, username, userEmailMap),
            subject: sprintf(mailTemplates.booklistDeliveredEmailTitle,
                bookList.name, bookList.createBy, bookList.studentName),
            content: sprintf(mailTemplates.booklistDeliveredEmailContent,
                bookList.name, bookList.createBy, bookList.studentName, comments, bookList.studentId, bookList.ID)
        }
    }

    var sendBookListMailAsync = function (bookList, username, action, comments, userEmailMap) {
        var params;
        if (action === 'CREATE')
            params = getCreateMailParams(bookList, username, userEmailMap);
        if (action === 'APPROVE')
            params = getApprovalMailParams(bookList, username, comments, userEmailMap);
        if (action === 'REJECT')
            params = getRejectMailParams(bookList, username, comments, userEmailMap);
        if (action === 'DELIVERED')
            params = getDeliverdMailParams(bookList, username, comments, userEmailMap);

        if (params)
            return sendMail.sendWithParamsAsync(params.email, 'lessons@readwithyou.com', params.subject, params.content, false);
        return;
    }

    function appendCorrespondenceAsync(bookList, username, action, comments) {
        if (!bookList.correspondence) {
            bookList.correspondence = [];
        }
        let newReply = {
            by: username,
            action: action,
            time: new Date().getTime(),
            content: comments
        }
        bookList.correspondence.push(newReply);

        if (action === 'APPROVE')
            bookList.status = 'PENDING_FOR_DELIVERY'
        if (action === 'REJECT')
            bookList.status = 'REJECTED';
        if (action === 'DELIVERED')
            bookList.status = 'DELIVERED';
        if (action === 'FINISHED')
            bookList.status = 'FINISHED';

        bookList.modifyTime = new Date().getTime();
        bookList.modifyBy = username;

        return bookListDao.updateAsync(bookList);
    }

    function outboundBookInBooksListAsync(bookList, username, isbn, expressNo) {
        var bookId = null;
        bookList.books.filter(b => b.isbn === isbn).forEach(b => {
            if (b.expressNo)
                throw "Book already outbound. Cannot outbound again!";
            else {
                b.expressNo = expressNo;
                bookId = b.ID;
            }
        });

        let inventory = {
            EventTime: new Date().getTime(),
            type: 'outbound',
            BookId: bookId,
            quantity: 1,
            actor: username,
            description: JSON.stringify({
                studentId: bookList.studentId,
                studentName: bookList.studentName,
                bookListId: bookList.ID,
                bookListName: bookList.name,
                expressNo: expressNo
            })
        };

        let bookListPromise = bookListDao.updateAsync(bookList);
        let inventoryPromise = inventoryDao.createAsync(inventory);

        return Promise.all([bookListPromise, inventoryPromise]);
    }

    function reviewAsync(id, username, action, comments) {
        var bookList;

        return bookListDao.getAsync(id).then(
            (data) => {
                bookList = data.Item;
                appendCorrespondenceAsync(data.Item, username, action, comments)
            },
            (err) => console.log('getAsync DDB Error: ' + err)
        ).then(
            () => buildUserEmailMap(),
            (err) => console.log('DDB Error: ' + err)
        ).then(
            (userEmailMap) => sendBookListMailAsync(bookList, username, action, comments, userEmailMap),
            (err) => console.log('appendCorrespondenceAsync Error: ' + err)
        ).then(
            () => bookListDao.getAsync(id),
            (err) => console.log('sendBookListMailAsync DDB Error: ' + err)
        );
    }

    function outboundAsync(id, username, isbn, expressNo) {
        return bookListDao.getAsync(id).then(
            (data) => outboundBookInBooksListAsync(data.Item, username, isbn, expressNo),
            (err) => console.log('getAsync DDB Error: ' + err)
        ).then(
            () => bookListDao.getAsync(id),
            (err) => console.log('outboundBookInBooksListAsync DDB Error: ' + err)
        );
    }

    function createAsync(item, username) {
        item.ID = generatorId();
        item.createTime = new Date().getTime();
        item.createBy = username;
        item.status = 'PENDING_FOR_APPROVAL';

        return bookListDao.createAsync(item).then(
            () => buildUserEmailMap(),
            (err) => console.log('DDB Error: ' + err)
        ).then(
            (userEmailMap) => sendBookListMailAsync(item, username, 'CREATE', '', userEmailMap),
            (err) => console.log('DDB Error: ' + err)
        );
    }

    return {
        createAsync,
        reviewAsync,
        outboundAsync
    };
}();

module.exports = bookListService;