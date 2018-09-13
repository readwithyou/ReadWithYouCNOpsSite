var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

var verifyToken = require('../service/verify-token');
var generatorId = require('../service/generate-id');
var bookListDao = require('../dao/book-list-dao');
var bookListService = require('../service/book-list-service');

//create
router.post('/', verifyToken, function (req, res, next) {
    bookListService.createAsync(req.body, req.username).then(
        () => res.status(200).end(),
        () => res.status(500).end()
    );
});

router.get('/', verifyToken, function (req, res, next) {
    bookListDao.scanAsync().then(
        (data) => res.json(data.Items),
        () => res.status(500).end()
    );
});

router.get('/pending', verifyToken, function (req, res, next) {
    var promises = [
        bookListDao.queryByStatusAsync('PENDING_FOR_APPROVAL'),
        bookListDao.queryByStatusAsync('PENDING_FOR_DELIVERY'),
        bookListDao.queryByStatusAsync('REJECTED')
    ];

    Promise.all(promises).then(
        (results) => {
            var items = [];
            results.forEach(r => items = items.concat(r.Items));
            res.json(items);
        },
        () => res.status(500).end()
    );
});

router.get('/pending/mine', verifyToken, function (req, res, next) {
    var promises = [
        bookListDao.queryByStatusAsync('PENDING_FOR_APPROVAL', req.username),
        bookListDao.queryByStatusAsync('PENDING_FOR_DELIVERY', req.username),
        bookListDao.queryByStatusAsync('REJECTED', req.username)
    ];

    Promise.all(promises).then(
        (results) => {
            var items = [];
            results.forEach(r => items = items.concat(r.Items));
            res.json(items);
        },
        () => res.status(500).end()
    );
});

router.post('/query', verifyToken, function (req, res, next) {
    let item = req.body;
    let studentId = item.studentId;

    bookListDao.queryByStudentIdAsync(studentId).then(
        (data) => res.json(data.Items),
        () => res.status(500).end()
    );
});

router.get('/:id', verifyToken, function (req, res, next) {
    bookListDao.getAsync(req.params.id).then(
        (data) => res.json(data.Item),
        () => res.status(500).end()
    );
});

router.put('/:id', verifyToken, function (req, res, next) {
    var item = req.body;
    item.modifyTime = new Date().getTime();
    item.modifyBy = req.username;

    bookListDao.updateAsync(item).then(
        (data) => res.json(data.Item),
        () => res.status(500).end()
    );
});

router.delete('/:id', verifyToken, function (req, res, next) {
    bookListDao.removeAsync(req.params.id).then(
        (data) => res.status(200).end(),
        (err) => res.status(500).end()
    );
});

router.post('/:id/review', verifyToken, function (req, res, next) {
    let id = req.params.id;
    let action = req.body.action;
    let comments = req.body.comments;

    bookListService.reviewAsync(id, req.username, action, comments).then(
        (data) => res.json(data.Item),
        () => res.status(500).end()
    );
});

router.post('/:id/outbound', verifyToken, function (req, res, next) {
    let id = req.params.id;
    let isbn = req.body.isbn;
    let expressNo = req.body.expressNo;

    bookListService.outboundAsync(id, req.username, isbn, expressNo).then(
        (data) => res.json(data.Item),
        () => res.status(500).end()
    );
});

module.exports = router;