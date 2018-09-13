var AWS = require('aws-sdk');
var awsRegion = 'cn-north-1';
var ddbTable = 'Course_Plan';

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

    var queryByStudentIdAsync = function (studentId) {
        var params = {
            TableName: ddbTable,
            IndexName: "studentId-index",
            KeyConditionExpression: " studentId = :studentId",
            ExpressionAttributeValues: {
                ':studentId': studentId
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

    var queryByTeacherIdAsync = function (teacherId) {
        var params = {
            TableName: ddbTable,
            IndexName: "teacherId-index",
            KeyConditionExpression: " teacherId = :teacherId",
            ExpressionAttributeValues: {
                ':teacherId': teacherId
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

    var updateStatusAsync = function (id, status) {
        var params = {
            TableName: ddbTable,
            Key: {
                ID: id
            },
            UpdateExpression: 'SET #status =:status',
            ExpressionAttributeNames: {
                '#status': 'status'
            },
            ExpressionAttributeValues: {
                ':status': status
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

    return {
        createAsync,
        queryByStudentIdAsync,
        queryByTeacherIdAsync,
        updateStatusAsync
    };
}();

module.exports = dao;