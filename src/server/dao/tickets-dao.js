var AWS = require('aws-sdk');
var awsRegion = 'cn-north-1';
var ddbTable = 'Tickets';

var dao = function () {
    AWS.config.region = awsRegion;
    var docClient = new AWS.DynamoDB.DocumentClient({
        convertEmptyValues: true
    });

    var createAsync = function (item) {
        var params = {
            TableName: ddbTable,
            Item: item,
            ConditionExpression: 'attribute_not_exists(ID)',
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

    var getAsync = function (id) {
        var params = {
            TableName: ddbTable,
            Key: {
                ID: id
            }
        };

        return new Promise(function (resolve, reject) {
            docClient.get(params, function (err, data) {
                if (err) {
                    console.log('Get DDB Error: ' + err);
                    reject(err);
                }
                resolve(data);
            });
        });
    };

    var scanAsync = function () {
        var params = {
            TableName: ddbTable,
            ProjectionExpression: "ID, assignTo, createBy, createTime, modifyTime, priority, #status, title, #type, modifyBy",
            ExpressionAttributeNames: {
                "#status": "status",
                "#type": "type",
            },
        };

        return new Promise(function (resolve, reject) {
            docClient.scan(params, function (err, data) {
                if (err) {
                    console.log('Scan DDB Error: ' + err);
                    reject(err);
                }
                resolve(data);
            });
        });
    };

    var queryAsync = function (assignTo, status) {
        var params = {
            TableName: ddbTable,
            ProjectionExpression: "ID, createTime, priority, #status, title, #type",
            FilterExpression: 'assignTo = :assignTo AND #status = :status',
            ExpressionAttributeNames: {
                "#status": "status",
                "#type": "type",
            },
            ExpressionAttributeValues: {
                ":assignTo": assignTo,
                ":status": status
            }
        };

        return new Promise(function (resolve, reject) {
            docClient.scan(params, function (err, data) {
                if (err) {
                    console.log('Scan DDB Error: ' + err);
                    reject(err);
                }
                resolve(data);
            });
        });
    };

    var updateAsync = function (item) {
        //inventory numbers are not allowed to updated directly.
        var params = {
            TableName: ddbTable,
            Item: item
        };

        return new Promise(function (resolve, reject) {
            docClient.put(params, function (err, data) {
                if (err) {
                    console.log('Update DDB Error: ' + err);
                    reject(err);
                }
                resolve(data);
            });
        });
    };

    return {
        getAsync,
        queryAsync,
        createAsync,
        scanAsync,
        updateAsync
    };
}();

module.exports = dao;