
var models = require('../../models');
var logging = require('../logger');
var logger = logging.logger;
const path = require('path');

module.exports = () => {
  logger.add(logging.winston.transports.File, {name: 'cleaner', filename: path.join(__dirname, 'tablecleaner.log')} );
  logger.info('node env is ', process.env.NODE_ENV);
  var today = new Date();
  logger.info('current time while running table cleaner: ', today);
  return models.sequelize.sync().then(() => {
      return models.Usage.findAll();
    }).then((results) => {
      logger.info("total of " + results.length + " results found");
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
    }).then(function (results) {
        logger.info('results that meet match for delete <= today: ', results.length);
        if(results != null && results.length > 0) {
          results.forEach((table) => {
            var ds = table.DataSource + 'Connection';
            models[ds].getQueryInterface().dropTable(table.TableName).then(() => {
              return models.Usage.update({Deleted: true}, {fields: ['Deleted'], where: {id: table.id}});
            }).then(() => {
              logger.info(table.TableName + ' on db ' + table.DataSource + ', deleted on ' + today);
            }).catch((err) => {
              logger.info("error dropping table ");
            });
          });
        } else {
          logger.info("No tables to delete on " + today);
        }
        logger.remove('cleaner');
    }).catch((err) => {
      logger.info("error while syncing db for table cleaner: " + err);
    });
}
