
var winston = require('winston');
var customLevels = {
  levels: {

  }
}
var logger = new (winston.Logger)({
  transports: [
      new (winston.transports.Console)()
  ]
});

module.exports = { logger, winston };

/*
if testing
  want to turn off logging of sequelize
  turn off info logging
  turn off morgan express server logging

*/
