var AWS = require('aws-sdk');
var awsRegion = 'cn-north-1';
var ddbTable = 'Book_Inventory';

var dao = function () {
    AWS.config.region = awsRegion;
    var docClient = new AWS.DynamoDB.DocumentClient({
        convertEmptyValues: true
    });

    var createAsync = function (item) {
        var params = {
            TableName: ddbTable,
            Item: item
        };

        return new Promise(function (resolve, reject) {
            docClient.put(params, function (err, data) {
                if (err) {
                    console.log('Put DDB Error: ' + err);
                    reject(err);
                }
                resolve(data);
            });
        });
    };

    var queryByTimeAsync = function (bookId, after, before) {
        var params = {
            TableName: ddbTable,
            KeyConditionExpression: " BookId = :bookId and #EventTime BETWEEN :after and :before",
            ExpressionAttributeNames: {
                '#EventTime': 'EventTime'
            },
            ExpressionAttributeValues: {
                ':bookId': bookId,
                ':after': after,
                ':before': before
            },
            "ScanIndexForward": false
        };

        return new Promise(function (resolve, reject) {
            docClient.query(params, function (err, data) {
                if (err) {
                    console.log('Query DDB Error: ' + err);
                    reject(err);
                }
                resolve(data);
            });
        });
    };

    return {
        createAsync,
        queryByTimeAsync
    };
}();

module.exports = dao;