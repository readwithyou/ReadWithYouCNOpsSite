var shortid = require('shortid');
var registrationDao = require('../dao/reg-dao');

var service = function () {
    var persist = function (req, res, type) {
        var item = {
            'ID': shortid.generate(),
            'CreateTime': new Date().toISOString(),
            'Type': type
        };

        var attributes = [
            'chineseName',
            'englishName',
            'gender',
            'age',
            'parentsName',
            'relationship',
            'phone',
            'wechat',
            'email',
            'question01',
            'question02',
            'question03',
            'question04',
            'question05',
            'question06',
            'question07',
            'remarks',
            'tag'
        ];

        attributes.forEach(function (attr) {
            if (req.body[attr]) {
                item[attr] = req.body[attr];
            }
        });

        registrationDao.save(item, function (err, data) {
            if (err) {
                var returnStatus = 500;
                if (err.code === 'ConditionalCheckFailedException') {
                    returnStatus = 409;
                }
                res.status(returnStatus).end();
                console.log('DDB Error: ' + err);
            } else {
                res.render('register-success');
            }
        });
    };

    var getAll = function (callback) {
        registrationDao.scan(callback);
    };

    return {
        persist: persist,
        getAll: getAll
    };
}();

module.exports = service;