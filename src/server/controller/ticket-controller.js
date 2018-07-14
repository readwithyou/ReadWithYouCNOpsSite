var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var verifyToken = require('../service/verify-token');
var generatorId = require('../service/generate-id');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var ticketDao = require('../dao/ticket-dao');

router.get('/:id', verifyToken, function (req, res, next) {
    ticketDao.getAsync(req.params.id).then(
        (data) => res.json(data.Item),
        (err) => res.status(500).end()
    );
});

router.put('/:id', verifyToken, function (req, res, next) {
    var item = req.body;
    item.modifyTime = new Date().getTime();
    item.modifyBy = req.username;

    ticketDao.updateAsync(req.params.id, item).then(
        (data) => res.json(data.Item),
        (err) => res.status(500).end()
    );
});

router.get('/', verifyToken, function (req, res, next) {
    ticketDao.scanAsync().then(
        (data) => res.json(data.Items),
        (err) => res.status(500).end()
    );
});

router.post('/', verifyToken, function (req, res, next) {
    var item = req.body;
    item.ID = generatorId();
    item.createTime = new Date().getTime();
    item.createBy = req.username;

    ticketDao.createAsync(item).then(
        (data) => res.status(200).end(),
        (err) => res.status(500).end()
    );
});

router.delete('/:id', verifyToken, function (req, res, next) {
    ticketDao.removeAsync(req.params.id).then(
        (data) => res.status(200).end(),
        (err) => res.status(500).end()
    );
});

module.exports = router;