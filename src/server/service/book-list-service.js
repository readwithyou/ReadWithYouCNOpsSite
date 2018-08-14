var bookListDao = require('../dao/book-list-dao');
var inventoryDao = require('../dao/inventory-dao');

var bookListService = function () {
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
        return bookListDao.getAsync(id).then(
            (data) => appendCorrespondenceAsync(data.Item, username, action, comments),
            (err) => console.log('getAsync DDB Error: ' + err)
        ).then(
            () => bookListDao.getAsync(id),
            (err) => console.log('handleInventoryAsync DDB Error: ' + err)
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

    return {
        reviewAsync,
        outboundAsync
    };
}();

module.exports = bookListService;