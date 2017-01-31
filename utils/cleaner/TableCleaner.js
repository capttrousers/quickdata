
var models = require('../../models');

var today = new Date();

// when running Table Cleaner, with cron script, models/config will be read from this dir
// need to update options storage for relative file path to sqlite db
models.sequelize.options.storage = '../.' + models.sequelize.options.storage;
console.log(models.sequelize.options.storage);
models.sequelize.sync().then(() => {
  models.Usage.findAll({
    attributes: ['id', 'TableName', 'DataSource', 'DeleteOn', 'Deleted'],
    // potentially remove this and do the processing of the entire results
    // if this check doesn't work properly
     where: {
      DeleteOn: {
        $lte: today
      }
      , Deleted: false
      , DataSource : {
        $not: 'csv'
      }
    }
  }).then((results) => {
    if(results != null && results.length > 0) {
      results.forEach((table) => {
        var ds = table.DataSource + 'Connection';
        models[ds].getQueryInterface().dropTable(table.TableName).then(() => {
          models.Usage.update(
            {Deleted: true}
            , {
              fields: ['Deleted'],
              where: {id: table.id}
            }
          );
        });
        console.log(table.TableName + ' on db ' + table.DataSource + ', deleted on ' + today);
      });
    } else {
      console.log("No tables to delete on " + today);
    }
  }).catch((err) => {
    console.log('error finding all records from usage table');
  });
}).catch((err) => {
  console.log("error while syncing db for table cleaner: " + err);
});
