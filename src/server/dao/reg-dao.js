var AWS = require('aws-sdk');
var awsRegion = 'cn-north-1';
var ddbTable = 'Students_Registration';

var dao = function () {
    AWS.config.region = awsRegion;
    var docClient = new AWS.DynamoDB.DocumentClient();

    var createAsync = function (item) {
        var params = {
            TableName: ddbTable,
            Item: item,
            ConditionExpression: 'attribute_not_exists(ID)',
        };

        return new Promise(function (resolve, reject) {
            docClient.put(params, function (err, data) {
                if (err) {
                    console.log('Create DDB Error: ' + err);
                    reject(err);
                }
                resolve(data);
            });
        });
    };

    var updateAsync = function (item) {
        var params = {
            TableName: ddbTable,
            Item: item
        };

        return new Promise(function (resolve, reject) {
            docClient.put(params, function (err, data) {
                if (err) {
                    console.log('Create DDB Error: ' + err);
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
            ProjectionExpression: "ID, enName, cnName, #type, #tag, createTime, #status, scheduledTime, teacherId",
            ExpressionAttributeNames: {
                "#type": "type",
                "#tag": "tag",
                "#status": "status",
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

    var removeAsync = function (id) {
        var params = {
            TableName: ddbTable,
            Key: {
                ID: id
            }
        };

        return new Promise(function (resolve, reject) {
            docClient.delete(params, function (err, data) {
                if (err) {
                    console.log('Delete DDB Error: ' + err);
                    reject(err);
                }
                resolve(data);
            });
        });
    };

    var queryByScheduledTimeAsync = function (status, scheduledTimeAfter, scheduledTimeBefore) {
        var params = {
            TableName: ddbTable,
            IndexName: 'schedule-status-time',
            KeyConditionExpression: "#status = :status and scheduledTime BETWEEN :scheduledTimeAfter and :scheduledTimeBefore",
            ExpressionAttributeNames: { '#status': 'status' },
            ExpressionAttributeValues: {
                ':status': status,
                ':scheduledTimeAfter': scheduledTimeAfter,
                ':scheduledTimeBefore': scheduledTimeBefore
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
        getAsync,
        createAsync,
        updateAsync,
        scanAsync,
        removeAsync,
        queryByScheduledTimeAsync
    };
}();

module.exports = dao;