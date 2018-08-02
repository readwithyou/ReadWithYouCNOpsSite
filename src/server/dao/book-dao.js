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
                    console.log('Put DDB Error: ' + err + ' ' + item.ID);
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
            Limit: 30,//just limit 30 items for now.
            ProjectionExpression: "ID, code, #name, #set, #language, isbn, readLevel, priority, quantity, locked",
            ExpressionAttributeNames: {
                "#name": "name",
                "#set": "set",
                "#language": "language"
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

    var queryByLevelAsync = function (language, startLevel, endLevel) {
        var params = {
            TableName: ddbTable,
            IndexName: "language-readLevel-index",
            KeyConditionExpression: " #language = :language and readLevel BETWEEN :startLevel and :endLevel",
            ExpressionAttributeNames: {
                '#language': 'language'
            },
            ExpressionAttributeValues: {
                ':language': language,
                ':startLevel': startLevel,
                ':endLevel': endLevel
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
        getAsync,
        scanAsync,
        updateAsync,
        updateQuantityAsync,
        updateLockedAsync,
        removeAsync,
        queryByLevelAsync
    };
}();

module.exports = dao;