function maskResponse(req, res, next) {
    var mask = function (item) {
        var maskText = '******';
        if (item.email) {
            item.email = maskText;
        }
        if (item.phone) {
            item.phone = maskText;
        }
        if (item.wechat) {
            item.wechat = maskText;
        }
    };

    var oldJson = res.json;

    res.json = function (data) {
        if (req.group !== 'ops_admin') {
            if (Array.isArray(arguments[0])) {
                arguments[0].forEach(function (element) {
                    mask(element);
                });
            }
            else {
                mask(arguments[0]);
            }
        }
        oldJson.apply(res, arguments);
    }
    next();
}

module.exports = maskResponse;