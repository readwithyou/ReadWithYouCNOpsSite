var AWS = require('aws-sdk');
var awsRegion = 'cn-north-1';
var ddbTable = 'Book';

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

    var updateAsync = function (item) {
        //inventory numbers are not allowed to updated directly.
        var params = {
            TableName: ddbTable,
            Item: item,
            ConditionExpression: 'quantity = :quantity AND locked = :locked',
            ExpressionAttributeValues: {
                ":quantity": item.quantity,
                ":locked": item.locked
            },
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

    var updateQuantityAsync = function (id, quantityInc) {
        var params = {
            TableName: ddbTable,
            Key: {
                "ID": id
            },
            UpdateExpression: "ADD quantity :quantityInc",
            ExpressionAttributeValues: {
                ":quantityInc": quantityInc
            },
            ReturnValues: "UPDATED_NEW"
        };

        return new Promise(function (resolve, reject) {
            docClient.update(params, function (err, data) {
                if (err) {
                    console.log('updateQuantityAsync DDB Error: ' + err);
                    reject(err);
                }
                resolve(data);
            });
        });
    };

    var updateLockedAsync = function (id, lockedInc) {
        var params = {
            TableName: ddbTable,
            Key: {
                "ID": id
            },
            UpdateExpression: "ADD locked :lockedInc",
            ExpressionAttributeValues: {
                ":lockedInc": lockedInc
            },
            ReturnValues: "UPDATED_NEW"
        };

        return new Promise(function (resolve, reject) {
            docClient.update(params, function (err, data) {
                if (err) {
                    console.log('updateLockedAsync DDB Error: ' + err);
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
        createAsync: createAsync,
        getAsync: getAsync,
        scanAsync: scanAsync,
        updateAsync: updateAsync,
        updateQuantityAsync: updateQuantityAsync,
        updateLockedAsync: updateLockedAsync,
        removeAsync: removeAsync,
    };
}();

module.exports = dao;