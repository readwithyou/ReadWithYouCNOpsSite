var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

var verifyToken = require('../service/verify-token');
var generatorId = require('../service/generate-id');
var regService = require('../service/reg-service');

var registrationDao = require('../dao/reg-dao');
var s3Accessor = require('../dao/s3-accessor');

router.get('/:id', verifyToken, function (req, res, next) {
    registrationDao.getAsync(req.params.id).then(
        (data) => res.json(data.Item),
        (err) => res.status(500).end()
    );
});

router.get('/', verifyToken, function (req, res, next) {
    registrationDao.scanAsync().then(
        (data) => res.json(data.Items),
        (err) => res.status(500).end()
    );
});

router.post('/', verifyToken, function (req, res, next) {
    var item = req.body;
    item.ID = generatorId();
    item.createTime = new Date().toISOString();

    registrationDao.createAsync(item).then(
        (data) => res.status(200).end(),
        (err) => res.status(500).end()
    );
});

router.post('/:id/schedule', verifyToken, function (req, res, next) {
    var item = req.body;
    item.status = 1;
    registrationDao.updateAsync(req.params.id, item).then(
        (data) => res.status(200).end(),
        (err) => res.status(500).end()
    );
});

router.delete('/:id', verifyToken, function (req, res, next) {
    registrationDao.removeAsync(req.params.id).then(
        (data) => res.status(200).end(),
        (err) => res.status(500).end()
    );
});

router.post('/upload-url', verifyToken, function (req, res, next) {
    var item = req.body;
    s3Accessor.getPutSignedUrlAsync(item.filePath, 3600, item.contentType).then(
        (data) => res.json({ url: data.url }),
        (err) => res.status(500).end()
    );
});

router.post('/download-url', verifyToken, function (req, res, next) {
    var item = req.body;

    s3Accessor.getGetSignedUrlAsync(item.filePath, 3600).then(
        (data) => res.json({ url: data.url }),
        (err) => res.status(500).end()
    );
});

router.post('/:id/student-scheduling-mail', verifyToken, function (req, res, next) {
    regService.mailScheduleToStudentAsync(req.params.id)
        .then(
            () => res.status(200).end(),
            (err) => { console.log('Mail To Student Send Error: ' + err); res.status(500).end() }
        )
});

router.post('/:id/teacher-scheduling-mail', verifyToken, function (req, res, next) {
    regService.mailScheduleToTeacherAsync(req.params.id)
        .then(
            () => res.status(200).end(),
            (err) => { console.log('Mail To Teacher Send Error: ' + err); res.status(500).end() }
        )
});

module.exports = router;