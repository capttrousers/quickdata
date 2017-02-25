
var models = require('../../models');
var logging = require('../logger');
var logger = logging.logger;
const path = require('path');
var testing   = process.env.NODE_TESTING || false;

module.exports = () => {
  logger.add(logging.winston.transports.File, {name: 'cleaner', filename: path.join(__dirname, 'tablecleaner.log')} );
  logger.info('table cleaner logger added : tablecleaner.log');
  logger.info('node env is ', process.env.NODE_ENV);
  // if testing, will be checking testing usage sqlite db,
  // so clear out all mysql tables that were created in http tests
  var today = (testing) ? new Date().setYear((new Date()).getFullYear() + 1) : new Date();
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

          return results.reduce(function(loop,table) {
            return loop.then(function(){
              var dataSource = table.DataSource + 'Connection';
              return models[dataSource].getQueryInterface().dropTable(table.TableName).then(() => {
                return models.Usage.update({Deleted: true}, {fields: ['Deleted'], where: {id: table.id}});
              });
            }).then(function() {
              logger.info(table.TableName + ' on db ' + table.DataSource + ', deleted on ' + today);
            });
          }, Promise.resolve());

          // results.forEach((table) => {
          //   var dataSource = table.DataSource + 'Connection';
          //   models[dataSource].getQueryInterface().dropTable(table.TableName).then(() => {
          //     return models.Usage.update({Deleted: true}, {fields: ['Deleted'], where: {id: table.id}});
          //   }).then(() => {
          //     logger.info(table.TableName + ' on db ' + table.DataSource + ', deleted on ' + today);
          //   }).catch((err) => {
          //     logger.info("error dropping table ");
          //   });
          // });
        } else {
          logger.info("No tables to delete on " + today);
        }
    }).catch((err) => {
      logger.info("error while syncing db for table cleaner: " + err);
    }).then(function() {
      logger.remove('cleaner');
    });
}
