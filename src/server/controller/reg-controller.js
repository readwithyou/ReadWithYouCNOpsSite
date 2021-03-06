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

router.get('/', verifyToken, function (req, res, next) {
    registrationDao.scanAsync().then(
        (data) => res.json(data.Items),
        (err) => res.status(500).end()
    );
});

router.get('/pending', verifyToken, function (req, res, next) {
    registrationDao.queryAsync(0).then(
        (data) => res.json(data.Items),
        () => res.status(500).end()
    );
});

router.get('/:id', verifyToken, function (req, res, next) {
    registrationDao.getAsync(req.params.id).then(
        (data) => res.json(data.Item),
        (err) => res.status(500).end()
    );
});

router.post('/', verifyToken, function (req, res, next) {
    var item = req.body;
    item.ID = generatorId();
    item.createTime = new Date().toISOString();
    item.createBy = req.username;

    registrationDao.createAsync(item).then(
        (data) => res.status(200).end(),
        (err) => res.status(500).end()
    );
});

router.put('/:id', verifyToken, function (req, res, next) {
    var item = req.body;
    item.modifyTime = new Date().getTime();
    item.modifyBy = req.username;

    if (item.scheduledTime) item.status = 1;
    if (item.courseResultFiles && item.courseResultFiles.length > 0) item.status = 2;
    registrationDao.updateAsync(item).then(
        (data) => res.json(data.Item),
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

router.post('/:id/student-report-mail', verifyToken, function (req, res, next) {
    regService.mailReportToStudentAsync(req.params.id)
        .then(
            () => res.status(200).end(),
            (err) => { console.log('Mail To Student Send Error: ' + err); res.status(500).end() }
        )
});

router.post('/:id/teacher-report-mail', verifyToken, function (req, res, next) {
    regService.mailReportToTeacherAsync(req.params.id)
        .then(
            () => res.status(200).end(),
            (err) => { console.log('Mail To Teacher Send Error: ' + err); res.status(500).end() }
        )
});

router.post('/:id/promote', verifyToken, function (req, res, next) {
    regService.promoteAsStudentAsync(req.params.id, req.username)
        .then(
            () => res.status(200).end(),
            (err) => { console.log('Promote As Student Async Error: ' + err); res.status(500).end() }
        )
});

module.exports = router;