var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

var verifyToken = require('../service/verify-token');
var inventoryDao = require('../dao/inventory-dao');

router.post('/', verifyToken, function (req, res, next) {
    var item = req.body;
    item.actor = req.username;
    item.EventTime = new Date().getTime();

    inventoryDao.createAsync(item).then(
        () => res.status(200).end(),
        () => res.status(500).end()
    );
});

router.post('/query', verifyToken, function (req, res, next) {
    var item = req.body;

    inventoryDao.queryByTimeAsync(item.bookId, item.after, item.before).then(
        (data) => res.json(data.Items),
        () => res.status(500).end()
    );
});

module.exports = router;