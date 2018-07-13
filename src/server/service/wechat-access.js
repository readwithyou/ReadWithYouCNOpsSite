var rp = require('request-promise-native');
var sprintf = require('sprintf-js').sprintf;
var config = require('../config');

var wechatAccess = function () {
    var accessTokenAsync = function () {
        let url = sprintf(config.wechatTokenUrl, config.wechatAppid, config.wechatSecret);
        var options = {
            method: 'POST',
            uri: url,
            json: true
        };

        return rp(options);
    };

    var sendCourseNotification = function (accessToken, touser, studentName, courseTime) {
        let url = sprintf(config.wechatTemplateMessageUrl, accessToken);
        var options = {
            method: 'POST',
            uri: url,
            body: {
                touser: touser,
                template_id: config.wechatCourseNotificationTemplateId,
                data: {
                    first: { value: sprintf('你好，以下课程将在%s进行。请在预定上课时间前的10分钟进入教室。\n', courseTime) },
                    keyword1: { value: '英语试课', color: "#173177" },
                    keyword2: { value: studentName, color: "#173177" },
                    remark: { value: '\n感谢您对工作室的信任。如您有任何问题，请随时联系我们。\n\n谢谢!\n陪你读书工作室' }
                }
            },
            json: true
        };

        return rp(options);
    };

    return {
        accessTokenAsync: accessTokenAsync,
        sendCourseNotification: sendCourseNotification
    };
}();

module.exports = wechatAccess;