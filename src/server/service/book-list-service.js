var bookListDao = require('../dao/book-list-dao');

var bookListService = function () {
    function appendCorrespondence(bookList, username, action, comments) {
        if (!bookList.correspondence) {
            bookList.correspondence = [];
        }
        let newReply = {
            by: username,
            time: new Date().getTime(),
            content: comments
        }
        bookList.correspondence.push(newReply);

        if (action === 'APPROVE')
            bookList.status = 'PENDING_FOR_DELIVERY'
        if (action === 'REJECT')
            bookList.status = 'REJECTED';

        bookList.modifyTime = new Date().getTime();
        bookList.modifyBy = username;

        return bookListDao.updateAsync(bookList);
    }

    function review(id, username, action, comments) {
        var bookList;
        return bookListDao.getAsync(id).then(
            (data) => { bookList = data.Item; return appendCorrespondence(bookList, username, action, comments); },
            (err) => console.log('DDB Error: ' + err)
        ).then(
            () => bookListDao.getAsync(id),
            (err) => console.log('DDB Error: ' + err)
        );
    }

    return {
        review
    };
}();

module.exports = bookListService;