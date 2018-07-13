var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var verifyToken = require('../service/verify-token');
var generatorId = require('../service/generate-id');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var teacherDao = require('../dao/teacher-dao');

router.get('/:id', verifyToken, function (req, res, next) {
    teacherDao.getAsync(req.params.id).then(
        (data) => res.json(data.Item),
        (err) => res.status(500).end()
    );
});

router.put('/:id', verifyToken, function (req, res, next) {
    var item = req.body;
    item.modifyTime = new Date().getTime();
    item.modifyBy = req.username;

    teacherDao.updateAsync(req.params.id, item).then(
        (data) => res.json(data.Item),
        (err) => res.status(500).end()
    );
});

router.get('/', verifyToken, function (req, res, next) {
    teacherDao.scanAsync().then(
        (data) => res.json(data.Items),
        (err) => res.status(500).end()
    );
});

router.post('/', verifyToken, function (req, res, next) {
    var item = req.body;
    item.ID = generatorId();
    item.createTime = new Date().getTime();
    item.createBy = req.username;

    teacherDao.createAsync(item).then(
        (data) => res.status(200).end(),
        (err) => res.status(500).end()
    );
});

router.delete('/:id', verifyToken, function (req, res, next) {
    teacherDao.removeAsync(req.params.id).then(
        (data) => res.status(200).end(),
        (err) => res.status(500).end()
    );
});

module.exports = router;