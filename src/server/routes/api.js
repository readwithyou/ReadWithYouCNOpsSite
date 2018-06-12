var express = require('express');
var router = express.Router();
var registrationService = require('../service/reg-service');

router.get('/registrations/:id', function (req, res, next) {
    registrationService.get(req.params.id, function (err, data) {
        if (err) {
            var returnStatus = 500;
            res.status(returnStatus).end();
        } else {
            res.json(data.Item);
        }
    });
});

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

router.post('/registrations', function (req, res, next) {
    registrationService.create(req.body, function (err) {
        var returnStatus = 200;
        if (err) {
            var returnStatus = 500;
        }
        res.status(returnStatus).end();
    });
});

router.delete('/registrations/:id', function (req, res, next) {
    registrationService.remove(req.params.id, function (err) {
        var returnStatus = 200;
        if (err) {
            var returnStatus = 500;
        }
        res.status(returnStatus).end();
    });
});

module.exports = router;