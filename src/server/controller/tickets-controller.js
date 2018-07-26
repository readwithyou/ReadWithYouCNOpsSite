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

router.get('/', verifyToken, function (req, res, next) {
    ticketService.getAllTickets().then(
        (data) => res.json(data.Items),
        () => res.status(500).end()
    );
});

router.get('/:id', verifyToken, function (req, res, next) {
    ticketService.getTicket(req.params.id).then(
        (data) => res.json(data.Item),
        () => res.status(500).end()
    );
});

router.post('/', verifyToken, function (req, res, next) {
    ticketService.createTicket(req.body, req.username).then(
        () => res.status(200).end(),
        () => res.status(500).end()
    );
});

router.put('/:id', verifyToken, function (req, res, next) {
    ticketService.updateTicket(req.body, req.username).then(
        (data) => res.json(data.Item),
        () => res.status(500).end()
    );
});

router.post('/:id/correspondence', verifyToken, function (req, res, next) {
    let id = req.params.id;
    let reply = req.body.reply;

    ticketService.newCorrespondence(id, req.username, reply).then(
        (data) => res.json(data.Item),
        () => res.status(500).end()
    );
});

module.exports = router;