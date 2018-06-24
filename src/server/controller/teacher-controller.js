var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var verifyToken = require('./verify-token');
var generatorId = require('./generate-id');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var teacherDao = require('../dao/teacher-dao');

router.get('/:id', verifyToken, function (req, res, next) {
    teacherDao.get(req.params.id, function (err, data) {
        if (err) {
            console.log('DDB Error: ' + err);
            var returnStatus = 500;
            res.status(returnStatus).end();
        } else {
            res.json(data.Item);
        }
    });
});

router.get('/', verifyToken, function (req, res, next) {
    teacherDao.scan(function (err, data) {
        if (err) {
            var returnStatus = 500;
            res.status(returnStatus).end();
        } else {
            res.json(data.Items);
        }
    });
});

router.post('/', verifyToken, function (req, res, next) {
    var item = req.body;
    item.ID = generatorId();
    item.createTime = new Date().toISOString();

    teacherDao.create(item, function (err, data) {
        var returnStatus = 200;
        if (err) {
            console.log('DDB Error: ' + err);
            var returnStatus = 500;
        }
        res.status(returnStatus).end();
    });
});

router.delete('/:id', verifyToken, function (req, res, next) {
    teacherDao.remove(req.params.id, function (err, data) {
        var returnStatus = 200;
        if (err) {
            console.log('DDB Error: ' + err);
            var returnStatus = 500;
        }
        res.status(returnStatus).end();
    });
});

module.exports = router;