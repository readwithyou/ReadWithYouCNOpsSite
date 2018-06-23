const express = require('express');
var partials = require('express-partials');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', 'assets');

app.use(partials());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('dist/assets'))

app.use('/', require('./routes/index'));
app.use('/api', require('./routes/api'));

var AuthController = require('./controller/auth-controller');
app.use('/api/auth', AuthController);

var RegController = require('./controller/reg-controller');
app.use('/api/registrations', RegController);

const port = process.env.PORT || 8000;
// Server
/*
app.listen(port, () => {
    console.log(`Listening on: http://localhost:${port}`);
});
*/
module.exports = app;