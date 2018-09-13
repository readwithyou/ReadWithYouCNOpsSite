var AWS = require('aws-sdk');
var awsRegion = 'cn-north-1';
var ddbTable = 'Book_List';

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

    var updateAsync = function (item) {
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

    var queryByStatusAsync = function (status, createBy) {
        var params = {
            TableName: ddbTable,
            ProjectionExpression: "ID, #name, #language, studentId, studentName, purpose, createBy, createTime, #status",
            ExpressionAttributeNames: {
                "#name": "name",
                "#language": "language",
                "#status": "status"
            }
        };

        if (createBy) {
            params.FilterExpression = '#status = :status AND createBy = :createBy';
            params.ExpressionAttributeValues = {
                ":status": status,
                ":createBy": createBy
            };
        } else {
            params.FilterExpression = '#status = :status';
            params.ExpressionAttributeValues = {
                ":status": status
            };
        }

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

    return {
        createAsync,
        getAsync,
        updateAsync,
        scanAsync,
        removeAsync,
        queryByStudentIdAsync,
        queryByStatusAsync
    };
}();

module.exports = dao;