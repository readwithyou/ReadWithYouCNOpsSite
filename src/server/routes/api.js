var express = require('express');
var router = express.Router();
var registrationService = require('../service/reg-service');

router.get('/registrations', function (req, res, next) {
    registrationService.getAll(function (err, data) {
        if (err) {
            var returnStatus = 500;
            res.status(returnStatus).end();
        } else {
            res.json(data.Items);
        }
    });
});

module.exports = router;