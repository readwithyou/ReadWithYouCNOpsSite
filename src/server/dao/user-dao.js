var AWS = require('aws-sdk');
var awsRegion = 'cn-north-1';
var ddbTable = 'User';

var dao = function () {
    AWS.config.region = awsRegion;
    var docClient = new AWS.DynamoDB.DocumentClient();

    var create = function (item, callback) {
        var params = {
            TableName: ddbTable,
            Item: item,
            ConditionExpression: 'attribute_not_exists(username)',
        };
        docClient.put(params, callback);
    };

    var get = function (username, callback) {
        var params = {
            TableName: ddbTable,
            Key: {
                username: username
            }
        };

        docClient.get(params, callback);
    };

    return {
        create: create,
        get: get
    };
}();

module.exports = dao;