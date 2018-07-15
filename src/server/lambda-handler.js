var regService = require('./service/reg-service');
var bookService = require('./service/book-service');

var handler = function () {
    function ddbHandler(event, context, callback) {
        let newRegistrationMailPromises = [];
        event.Records.forEach(function (record) {
            if (record.eventSourceARN.indexOf('Students_Registration') !== -1 && record.eventName === 'INSERT') {
                var newRecord = record.dynamodb.NewImage;
                var id = newRecord.ID.S;
                newRegistrationMailPromises.push(regService.mailNewRegistrationAsync(id));
            }
            if (record.eventSourceARN.indexOf('Book_Inventory') !== -1 && record.eventName === 'INSERT') {
                var newRecord = record.dynamodb.NewImage;

                var type = newRecord.type.S;
                var bookId = newRecord.BookId.S;
                var quantity = Number(newRecord.quantity.N);

                newRegistrationMailPromises.push(bookService.handleInventoryChangeAsync(bookId, type, quantity));
            }
        });
        Promise.all(newRegistrationMailPromises).then(
            () => context.done(null, "success"),
            (err) => context.done('DDB Handler error: ' + err)
        );
    };

    function courseNotificationHandler(event, context, callback) {
        console.log('### CourseNotificationHandler Start:');

        var beginTime = new Date(event.time).getTime() + 1800000;
        var endTime = beginTime + 900000;

        regService.notifyCourseOnWechatAsync(beginTime, endTime).then(
            () => context.done(null, "success"),
            (err) => context.done('Send course notification error:' + err)
        );
    };

    return {
        ddbHandler: ddbHandler,
        courseNotificationHandler: courseNotificationHandler
    };
}();

module.exports = handler;