var AWS = require('aws-sdk');
var awsRegion = 'ap-northeast-2';
var ddbTable = 'Students_Registration';

var dao = function () {
    AWS.config.region = awsRegion;
    var docClient = new AWS.DynamoDB.DocumentClient();

    var create = function (item, callback) {
        var params = {
            TableName: ddbTable,
            Item: item,
            ConditionExpression: 'attribute_not_exists(ID)',
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
        create: create,
        scan: scan
    };
}();

module.exports = dao;