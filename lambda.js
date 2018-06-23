const awsServerlessExpress = require('aws-serverless-express');
const app = require('./dist/server');
const server = awsServerlessExpress.createServer(app)
 
module.exports.universal = (event, context) => awsServerlessExpress.proxy(server, event, context);