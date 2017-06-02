var models = require('../../models');
var logging = require('../logger');
var logger = logging.logger;
const path = require('path');
var testing   = process.env.NODE_TESTING || false;

module.exports = (tables) => {
  logger.add(logging.winston.transports.File, {name: 'cleaner', filename: path.join(__dirname, 'tablecleaner.log')} );
  logger.info('process table logger added : tablecleaner.log');
  logger.info('node env is ', process.env.NODE_ENV);
  logger.info('tables results size', tables.length);
  return tables.reduce(function(loop,table) {
    return loop.then(function() {
      var dataSource = table.DataSource + 'Connection';
      return models.Usage.update({Deleted: true}, {fields: ['Deleted'], where: {id: table.id}}).then(() => {
        logger.info('set DELETED to true for table ' + table.TableName + ' on usage db, at timestamp:');
        return models[dataSource].getQueryInterface().dropTable(table.TableName).catch((err) => {
          logging.error('error dropping table : ', err);
        });
      }).then(() => {
        logger.info('deleted table ' + table.TableName + ' on db ' + table.DataSource + ', at timestamp:');
      }).catch((err) => {
        logger.error('error on drop table and updated usage table : ', err);
      });
    });
  }, Promise.resolve()).then(() => {
    logger.remove('cleaner');
  });
}
