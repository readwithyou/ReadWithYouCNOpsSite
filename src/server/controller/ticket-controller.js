var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var ticketService = require('../service/ticket-service');
var verifyToken = require('../service/verify-token');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/leave-mail', verifyToken, function (req, res, next) {
    ticketService.leaveMailAsync(req.body).then(
        () => res.status(200).end(),
        () => res.status(500).end()
    );
});

module.exports = router;