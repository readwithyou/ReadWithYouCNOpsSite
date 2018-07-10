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
            (results) => context.done(null, "success"),
            (err) => context.done('Mail new registration error: ' + err)
        );
    };

    function courseNotificationHandler(event, context, callback) {
        console.log('LogScheduledEvent');
        console.log('Received event:', JSON.stringify(event, null, 2));
        callback(null, 'Finished');
    };

    return {
        registrationDdbHandler: registrationDdbHandler,
        courseNotificationHandler: courseNotificationHandler
    };
}();

module.exports = handler;