var AWS = require('aws-sdk');
var awsRegion = 'ap-northeast-2';
var ddbTable = 'Students_Registration';

var dao = function () {
    AWS.config.region = awsRegion;
    var docClient = new AWS.DynamoDB.DocumentClient();

    var save = function (item, callback) {
        var params = {
            'TableName': ddbTable,
            'Item': item
        };
        docClient.put(params, callback);
    };

    var scan = function (callback) {
        var params = {
            TableName: ddbTable
        };

        docClient.scan(params, callback);
    };

    return {
        save: save,
        scan: scan
    };
}();

module.exports = dao;