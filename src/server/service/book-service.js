var bookDao = require('../dao/book-dao');

var bookService = function () {
    function handleInventoryChangeAsync(bookId, type, quantity) {
        switch (type) {
            case "inbound":
                return bookDao.updateQuantityAsync(bookId, quantity);
            case "outbound":
                return bookDao.updateQuantityAsync(bookId, -quantity);
            case "lock":
                return bookDao.updateLockedAsync(bookId, quantity);
            case "unlock":
                return bookDao.updateLockedAsync(bookId, -quantity);
            default:
                console.log("unrecoganized inventory type!!");
                return bookDao.updateQuantityAsync(bookId, 0);
        }
    }

    return {
        handleInventoryChangeAsync
    };
}();

module.exports = bookService;