var registrationDao = require('../dao/reg-dao');

var service = function () {
    var getAll = function (callback) {
        registrationDao.scan(callback);
    };

    var create = function (req, res, callback) {
        var item = req.body;
        item.ID = generateId();
        item.createTime = new Date().toISOString();

        registrationDao.create(item, function (err, data) {
            if (err) {
                console.log('DDB Error: ' + err);
            }
            callback(err);
        });
    };

    var generateId = function () {
        var date = new Date();
        var id = date.getFullYear() + '';

        id = (date.getMonth() < 10) ?
            id + '0' + (date.getMonth() + 1) :
            id + (date.getMonth() + 1);

        id = (date.getDate() < 10) ?
            id + '0' + date.getDate() :
            id + date.getDate();

        id = (date.getHours() < 10) ?
            id + '0' + date.getHours() :
            id + date.getHours();

        id = (date.getMinutes() < 10) ?
            id + '0' + date.getMinutes() :
            id + date.getMinutes();

        id = (date.getSeconds() < 10) ?
            id + '0' + date.getSeconds() :
            id + date.getSeconds();

        return id;
    }

    return {
        getAll: getAll,
        create: create
    };
}();

module.exports = service;