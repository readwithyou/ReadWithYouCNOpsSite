const awsServerlessExpress = require('aws-serverless-express');
const app = require('./dist/server');
const lambdaHandler = require('./src/server/lambda-handler');
const server = awsServerlessExpress.createServer(app)

module.exports.universal = (event, context) => awsServerlessExpress.proxy(server, event, context);
module.exports.ddb_handler = lambdaHandler.ddbHandler;
module.exports.course_notification_handler = lambdaHandler.courseNotificationHandler;