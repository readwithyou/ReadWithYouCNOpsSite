var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  res.status(200).send('API works.');
});

module.exports = router;