var AWS = require('aws-sdk')
var awsRegion = 'cn-north-1';
var bucketName = 'registrations'

var s3accessor = function () {
    AWS.config.region = awsRegion;
    var s3 = new AWS.S3();

    var getPutSignedUrlAsync = function (filePath, expires, contentType) {
        var params = {
            Bucket: bucketName,
            Key: filePath,
            Expires: expires,
            ContentType: contentType
        }

        return new Promise(function (resolve, reject) {
            s3.getSignedUrl('putObject', params, function (err, url) {
                if (err) {
                    console.log('S3 getPutSignedUrlAsync Error: ' + err);
                    reject(err);
                }
                resolve({
                    url: url
                });
            });
        });
    };

    var getGetSignedUrlAsync = function (filePath, expires) {
        var params = {
            Bucket: bucketName,
            Key: filePath,
            Expires: expires,
        }

        return new Promise(function (resolve, reject) {
            s3.getSignedUrl('getObject', params, function (err, url) {
                if (err) {
                    console.log('S3 getGetSignedUrlAsync Error: ' + err);
                    reject(err);
                }
                resolve({
                    filePath: filePath,
                    url: url
                });
            });
        });
    };

    return {
        getPutSignedUrlAsync: getPutSignedUrlAsync,
        getGetSignedUrlAsync: getGetSignedUrlAsync,
    };
}();

module.exports = s3accessor;