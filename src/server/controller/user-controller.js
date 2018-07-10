var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

var verifyToken = require('../service/verify-token');
var userDao = require('../dao/user-dao');

router.get('/', verifyToken, function (req, res, next) {
    userDao.scanAsync().then(
        (data) => res.json(data.Items),
        (err) => res.status(500).end()
    );
});

router.post('/:username/lock', verifyToken, function (req, res, next) {
    userDao.updateLockAsync(req.params.username, true).then(
        (data) => res.status(200).end(),
        (err) => res.status(500).end()
    );
});

router.post('/:username/unlock', verifyToken, function (req, res, next) {
    userDao.updateLockAsync(req.params.username, false).then(
        (data) => res.status(200).end(),
        (err) => res.status(500).end()
    );
});

module.exports = router;