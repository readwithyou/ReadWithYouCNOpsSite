const express = require('express');
var partials = require('express-partials');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
var maskResponse = require('./utils/mask-response');

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', 'assets');

app.use(partials());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('dist/assets'))
app.use(maskResponse);

app.use('/', require('./routes/index'));
app.use('/api', require('./routes/api'));

var AuthController = require('./controller/auth-controller');
app.use('/api/auth', AuthController);

var UserController = require('./controller/user-controller');
app.use('/api/users', UserController);

var RegController = require('./controller/reg-controller');
app.use('/api/registrations', RegController);

var TeacherController = require('./controller/teacher-controller');
app.use('/api/teachers', TeacherController);

var StudentController = require('./controller/student-controller');
app.use('/api/students', StudentController);

var TicketController = require('./controller/ticket-controller');
app.use('/api/tickets', TicketController);

var BookController = require('./controller/book-controller');
app.use('/api/books', BookController);

const port = process.env.PORT || 8000;
// Server
/*
app.listen(port, () => {
    console.log(`Listening on: http://localhost:${port}`);
});
*/
module.exports = app;