var AWS = require('aws-sdk')
var awsRegion = 'cn-north-1';
var bucketName = 'registrations'

var s3accessor = function () {
    AWS.config.region = awsRegion;
    var s3 = new AWS.S3();

    var getPutSignedUrl = function (filePath, contentType, callback) {
        var params = {
            Bucket: bucketName,
            Key: filePath,
            Expires: 3600,
            ContentType: contentType
        }
        //err, url
        s3.getSignedUrl('putObject', params, callback)
    };

    var getGetSignedUrl = function (filePath, callback) {
        var params = {
            Bucket: bucketName,
            Key: filePath,
            Expires: 3600,
        }
        //err, url
        s3.getSignedUrl('getObject', params, callback)
    };

    return {
        getPutSignedUrl: getPutSignedUrl,
        getGetSignedUrl: getGetSignedUrl,
    };
}();

module.exports = s3accessor;