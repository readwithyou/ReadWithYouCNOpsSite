var AWS = require('aws-sdk');
var awsRegion = 'cn-north-1';
var ddbTable = 'Teacher';

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

    var get = function (id, callback) {
        var params = {
            TableName: ddbTable,
            Key: {
                ID: id
            }
        };

        docClient.get(params, callback);
    };

    var scan = function (callback) {
        var params = {
            TableName: ddbTable
        };

        docClient.scan(params, callback);
    };

    var remove = function (id, callback) {
        var params = {
            TableName: ddbTable,
            Key: {
                ID: id
            }
        };
        docClient.delete(params, callback);
    };

    return {
        get: get,
        create: create,
        scan: scan,
        remove: remove
    };
}();

module.exports = dao;