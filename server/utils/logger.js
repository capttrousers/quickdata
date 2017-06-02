
var testing   = process.env.NODE_TESTING || false;
var debug   = process.env.DEBUG || false;
var winston = require('winston');
var path      = require('path');

var logLevel = (debug) ? "debug" : "info";

var logger = new (winston.Logger)({
  transports: [
      new (winston.transports.Console)({ level: logLevel })
  ]
});

if (testing) {
  logger.add(winston.transports.File, 
              { name: 'tests', 
                filename: path.join(__dirname, '../test/tests.log'), 
                level: logLevel });
  logger.remove(winston.transports.Console);
}


module.exports = { logger, winston };

/*
if testing
  want to turn off logging of sequelize // do this in model/index.js
  turn off info logging // do this here when setting up the winston logging
  turn off morgan express server logging  // need to do in app.js or server.js

*/
