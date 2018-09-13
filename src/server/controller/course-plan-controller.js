var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var verifyToken = require('../service/verify-token');
var generatorId = require('../service/generate-id');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var teacherDao = require('../dao/teacher-dao');
var coursePlanDao = require('../dao/course-plan-dao');

router.post('/', verifyToken, function (req, res, next) {
    var item = req.body;
    item.ID = generatorId();
    item.createTime = new Date().getTime();
    item.createBy = req.username;

    coursePlanDao.createAsync(item).then(
        (data) => res.status(200).end(),
        (err) => res.status(500).end()
    );
});

router.post('/query', verifyToken, function (req, res, next) {
    let item = req.body;
    let studentId = item.studentId;
    let teacherId = item.teacherId;

    if (studentId) {
        coursePlanDao.queryByStudentIdAsync(studentId).then(
            (data) => res.json(data.Items),
            () => res.status(500).end()
        );
    }
    else {
        coursePlanDao.queryByTeacherIdAsync(teacherId).then(
            (data) => res.json(data.Items),
            () => res.status(500).end()
        );
    }
});

router.post('/mine', verifyToken, function (req, res, next) {
    let username = req.username;

    teacherDao.queryByUsernameAsync(username).then(
        (data) => {
            if (!data.Items || data.Items.length == 0) {
                res.json([]);
            } else {
                let teacherId = data.Items[0].ID
                coursePlanDao.queryByTeacherIdAsync(teacherId).then(
                    (data) => {
                        let coursePlans = data.Items.filter(c => c.status !== 0);
                        res.json(coursePlans);
                    },
                    () => res.status(500).end()
                );
            }
        },
        () => res.status(500).end()
    );
});

router.post('/:id/status', verifyToken, function (req, res, next) {
    let id = req.params.id;
    let status = req.body.status;

    coursePlanDao.updateStatusAsync(id, status).then(
        (data) => res.status(200).end(),
        (err) => res.status(500).end()
    );
});

module.exports = router;