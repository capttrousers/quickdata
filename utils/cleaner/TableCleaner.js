
var models = require('../../models');
var logging = require('../logger');
var logger = logging.logger;
const path = require('path');
var testing   = process.env.NODE_TESTING || false;
var processTables = require('./processTables');

module.exports = () => {
  logger.add(logging.winston.transports.File, {name: 'cleaner', filename: path.join(__dirname, 'tablecleaner.log')} );
  logger.info('table cleaner logger added : tablecleaner.log');
  logger.info('node env is ', process.env.NODE_ENV);
  // if testing, will be checking testing usage sqlite db,
  // so clear out all mysql tables that were created in http tests

  // should not do this, on production server, all tables would get cleaned out
  // var today = (testing) ? new Date().setYear((new Date()).getFullYear() + 1) : new Date();
  var today = new Date();

  logger.info('current time while running table cleaner: ', today);
  return models.sequelize.sync().then(() => {
      return models.Usage.findAll({
        attributes: ['id', 'TableName', 'DataSource', 'DeleteOn', 'Deleted'],
        // potentially remove this and do the processing of the entire results
        // if this check doesn't work properly
         where: {
          DeleteOn: {
            $lte: today
          },
          Deleted: false,
          DataSource : {
            $not: 'csv'
          }
        }
      });
    }).then(function (tables) {
        logger.info('tables that meet match for delete <= today: ', tables.length);
        if(tables != null && tables.length > 0) {
          return processTables(tables);
        } else {
          logger.info("No tables to delete on " + today);
        }
    }).catch((err) => {
      logger.info("error while syncing db for table cleaner: " + err);
    }).then(function() {
      logger.remove('cleaner');
    });
}
