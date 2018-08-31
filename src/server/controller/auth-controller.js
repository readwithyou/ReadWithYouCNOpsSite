var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var userDao = require('../dao/user-dao');
var verifyToken = require('../service/verify-token');
var abilityRulesService = require('../service/ability-rules-service');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

/**
 * Configure JWT
 */
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bcrypt = require('bcryptjs');
var config = require('../config'); // get config file

router.post('/login', function (req, res) {
    userDao.getAsync(req.body.username).then(
        (user) => {
            if (!user.Item) return res.status(404).send('No user found.');
            if (user.Item.locked) return res.status(423).send('User is locked. Cannot Login.');

            // check if the password is valid
            var passwordIsValid = bcrypt.compareSync(req.body.password, user.Item.password);
            if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

            // if user is found and password is valid
            // create a token
            var token = jwt.sign({ id: user.Item.username, group: user.Item.group }, config.secret, {
                expiresIn: 86400// expires in 24 hours
            });

            // get ability rules
            var username = user.Item.username;
            var group = user.Item.group;
            var rules = abilityRulesService.getRules(username, group);

            // return the information including token as JSON
            return res.status(200).send({ auth: true, token: token, rules: rules });
        },
        (err) => res.status(500).send('Error on the server.')
    );
});

router.get('/logout', function (req, res) {
    res.status(200).send({ auth: false, token: null });
});

router.post('/signon', function (req, res) {
    var hashedPassword = bcrypt.hashSync(req.body.password, 8);
    req.body.password = hashedPassword;
    req.body.locked = true;

    userDao.createAsync(req.body).then(
        (data) => res.status(200).send(),
        (err) => {
            if (err.name === 'ConditionalCheckFailedException') {
                console.log('Condition check failure: ' + err);
                return res.status(409).send("Username already exist`.");
            } else {
                console.log('DDB Error: ' + err);
                return res.status(500).send("There was a problem signon the user`.");
            }
        }
    );
});

router.post('/pwd', function (req, res) {
    var username = req.body.username;
    var originPassword = req.body.originPassword;

    userDao.getAsync(username).then(
        (user) => {
            if (!user.Item) return res.status(404).send('No user found.');
            var passwordIsValid = bcrypt.compareSync(originPassword, user.Item.password);

            if (!passwordIsValid) return res.status(404).send('Password incorrect!');

            var newPassword = bcrypt.hashSync(req.body.newPassword, 8);
            userDao.updatePasswordAsync(username, newPassword).then(
                (data) => res.status(200).send(),
                (err) => res.status(500).send("There was a problem when changing the password.")
            );
        },
        (err) => res.status(500).send('Error on the server.')
    );
});

router.get('/me', verifyToken, function (req, res, next) {
    userDao.getAsync(req.username).then(
        (user) => {
            if (!user) return res.status(404).send("No user found.");
            user.password = '';
            res.status(200).send(user);
        },
        (err) => res.status(500).send('Error on the server.')
    );
});

module.exports = router;
