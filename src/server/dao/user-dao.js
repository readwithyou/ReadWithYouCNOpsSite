var AWS = require('aws-sdk');
var awsRegion = 'cn-north-1';
var ddbTable = 'User';

var dao = function () {
    AWS.config.region = awsRegion;
    var docClient = new AWS.DynamoDB.DocumentClient();

    var createAsync = function (item) {
        var params = {
            TableName: ddbTable,
            Item: item,
            ConditionExpression: 'attribute_not_exists(username)',
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

    var getAsync = function (username, callback) {
        var params = {
            TableName: ddbTable,
            Key: {
                username: username
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

    var updateProfileAsync = function (username, name, email) {
        var params = {
            TableName: ddbTable,
            Key: {
                username: username
            },
            UpdateExpression: 'SET #name =:name, #email =:email',
            ExpressionAttributeNames: {
                '#name': 'name',
                '#email': 'email'
            },
            ExpressionAttributeValues: {
                ':name': name,
                ':email': email
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

    var updatePasswordAsync = function (username, newPassword) {
        var params = {
            TableName: ddbTable,
            Key: {
                username: username
            },
            UpdateExpression: 'SET #password =:newPassword',
            ExpressionAttributeNames: {
                '#password': 'password'
            },
            ExpressionAttributeValues: {
                ':newPassword': newPassword
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

    var updateLockAsync = function (username, locked) {
        var params = {
            TableName: ddbTable,
            Key: {
                username: username
            },
            UpdateExpression: 'SET #locked =:locked',
            ExpressionAttributeNames: {
                '#locked': 'locked'
            },
            ExpressionAttributeValues: {
                ':locked': locked
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
        updateProfileAsync,
        updatePasswordAsync,
        getAsync,
        scanAsync,
        updateLockAsync
    };
}();

module.exports = dao;