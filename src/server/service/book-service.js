var fs = require('fs');
var parse = require('csv-parse');
var bookDao = require('../dao/book-dao');
var bookListDao = require('../dao/book-list-dao');

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

    function getSelectableBooksAsync(studentId, language, levelBaseline, purpose) {
        let startLevel = 0;
        let endLevel = 999;
        if (purpose === 'COURSE' && language === 'en') {
            startLevel = levelBaseline - 10;
            endLevel = levelBaseline + 10;
        }

        let queryBookListPromise = bookListDao.queryByStudentIdAsync(studentId);
        let queryBookPromise = bookDao.queryByLevelAsync(language, startLevel, endLevel);
        return Promise.all([queryBookListPromise, queryBookPromise]).then(
            values => {
                let existBookLists = values[0].Items;
                let bookIdsRead = [];
                existBookLists.filter(l => l.purpose === 'COURSE' || l.purpose === 'SHORT_COURSE')
                    .forEach(list =>
                        list.books.forEach(b =>
                            bookIdsRead.push(b.ID)
                        )
                    );

                let matchedBooks = values[1].Items;
                return matchedBooks.filter(b =>
                    b.ebookUrl && b.code && b.priority !== 'UNAVAILABLE' && !bookIdsRead.includes(b.ID)
                );
            }
        )
    }

    function generateBookCodeAsync(level) {
        let promise = bookDao.scanAsync();
        return promise.then(
            (data) => {
                let books = data.Items.filter(b => b.readLevel === level);
                if (books == null || books.length === 0) {
                    return (level / 10) + '001';
                }

                let largestCode = books.map(b => b.code).reduce(
                    (code1, code2) => code1 > code2 ? code1 : code2
                );
                let newCodeInNumber = Number(largestCode) + 1;

                if (newCodeInNumber < 10) return (level / 10) + '00' + newCodeInNumber;
                if (newCodeInNumber < 100) return (level / 10) + '0' + newCodeInNumber;
                if (newCodeInNumber < 1000) return (level / 10) + newCodeInNumber;
                return '' + newCodeInNumber;
            },
            (err) => console.log('GenerateNewBookCode DDB Error: ' + err)
        );
    }

    function convert(csvrow) {
        var readLevel = null;
        switch (csvrow[3]) {
            case "0": readLevel = 0; break;
            case "1": readLevel = 10; break;
            case "2": readLevel = 20; break;
            case "3": readLevel = 30; break;
            case "4": readLevel = 40; break;
            case "5": readLevel = 50; break;
            case "6": readLevel = 60; break;
            case "7": readLevel = 70; break;
            case "999": readLevel = 999; break;
            default: readLevel = 999;
        }

        var priority = null;
        switch (csvrow[6]) {
            case "1": priority = 'RECOMMENDED'; break;
            case "2": priority = 'OPTIONAL'; break;
            case "3": priority = 'NONRECOMMENDED'; break;
            case "4": priority = 'UNAVAILABLE'; break;
            default: priority = null;
        }

        var tag = null;
        if (csvrow[12]) {
            tag = [csvrow[12]];
        }

        var bookEntity = {
            ID: csvrow[0],
            code: csvrow[10],
            name: csvrow[1],
            set: csvrow[2],
            press: null,
            isbn: csvrow[7],
            type: 'TEXTBOOK',
            language: 'en',
            quantity: Number(csvrow[8]),
            locked: 0,
            price: null,
            priority: priority,
            readLevel: readLevel,
            ebookUrl: csvrow[9],
            retailUrl: null,
            description: csvrow[4],
            tag: tag,
            createBy: 'yonglinx',
            createTime: new Date().getTime(),
            modifyBy: 'yonglinx',
            modifyTime: new Date().getTime(),
        };
        return bookEntity;
    }
    /*
    function importBookFromCSV(filepath) {
        var books = [];
        fs.createReadStream(filepath)
            .pipe(parse({ delimiter: ',' }))
            .on('data', function (csvrow) {
                //do something with csvrow
                books.push(convert(csvrow));
            })
            .on('end', function () {
                ////////save books
                let bookSavePromise = [];
                books.forEach(b => bookSavePromise.push(bookDao.createAsync(b)));
                Promise.all(bookSavePromise).then(
                    () => console.log('save success'),
                    (err) => console.log('save err' + err),
                );
            });
    }
    */
    return {
        handleInventoryChangeAsync,
        getSelectableBooksAsync,
        generateBookCodeAsync
    };
}();

module.exports = bookService;