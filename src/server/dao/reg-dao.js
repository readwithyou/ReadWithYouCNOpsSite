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

    var updateAsync = function (id, item) {
        var params = {
            TableName: ddbTable,
            Key: {
                ID: id
            },
            UpdateExpression: 'SET #status =:status, #teacherId =:teacherId, #scheduledTime =:scheduledTime, #zoomLink =:zoomLink, #courseRemarks =:courseRemarks, #courseFiles =:courseFiles',
            ExpressionAttributeNames: {
                '#status': 'status',
                '#teacherId': 'teacherId',
                '#scheduledTime': 'scheduledTime',
                '#zoomLink': 'zoomLink',
                '#courseRemarks': 'courseRemarks',
                '#courseFiles': 'courseFiles',
            },
            ExpressionAttributeValues: {
                ':status': item.status,
                ':teacherId': item.teacherId,
                ':scheduledTime': item.scheduledTime,
                ':zoomLink': item.zoomLink,
                ':courseRemarks': item.courseRemarks,
                ':courseFiles': item.courseFiles,
            }
        };

        return new Promise(function (resolve, reject) {
            docClient.update(params, function (err, data) {
                if (err) {
                    console.log('Update DDB Error: ' + err);
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
            TableName: ddbTable
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

    return {
        getAsync: getAsync,
        createAsync: createAsync,
        updateAsync: updateAsync,
        scanAsync: scanAsync,
        removeAsync: removeAsync
    };
}();

module.exports = dao;