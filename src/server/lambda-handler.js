var regService = require('./service/reg-service');

var handler = function () {
    function registrationDdbHandler(event, context, callback) {
        let newRegistrationMailPromises = [];
        event.Records.forEach(function (record) {
            if (record.eventName === 'INSERT') {
                var newRecord = record.dynamodb.NewImage;
                var id = newRecord.ID.S;
                newRegistrationMailPromises.push(regService.mailNewRegistrationAsync(id));
            }
        });
        Promise.all(newRegistrationMailPromises).then(
            () => context.done(null, "success"),
            (err) => context.done('Mail new registration error: ' + err)
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
        registrationDdbHandler: registrationDdbHandler,
        courseNotificationHandler: courseNotificationHandler
    };
}();

module.exports = handler;