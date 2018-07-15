var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

var verifyToken = require('../service/verify-token');
var generatorId = require('../service/generate-id');
var bookDao = require('../dao/book-dao');

router.get('/:id', verifyToken, function (req, res, next) {
    bookDao.getAsync(req.params.id).then(
        (data) => res.json(data.Item),
        () => res.status(500).end()
    );
});

router.get('/', verifyToken, function (req, res, next) {
    bookDao.scanAsync().then(
        (data) => res.json(data.Items),
        () => res.status(500).end()
    );
});

router.post('/', verifyToken, function (req, res, next) {
    var item = req.body;
    item.ID = generatorId();
    item.quantity = 0;
    item.locked = 0;
    item.createTime = new Date().getTime();
    item.createBy = req.username;

    bookDao.createAsync(item).then(
        () => res.status(200).end(),
        () => res.status(500).end()
    );
});

router.put('/:id', verifyToken, function (req, res, next) {
    var item = req.body;
    item.modifyTime = new Date().getTime();
    item.modifyBy = req.username;

    bookDao.updateAsync(item).then(
        (data) => res.json(data.Item),
        () => res.status(500).end()
    );
});

router.delete('/:id', verifyToken, function (req, res, next) {
    bookDao.removeAsync(req.params.id).then(
        () => res.status(200).end(),
        () => res.status(500).end()
    );
});

module.exports = router;