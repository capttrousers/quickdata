
var models = require('../../models');
var debug = require('debug')('table cleaner')
var today = new Date();



models.sequelize.sync().then(() => {
  return models.Usage.findAll();
}).then((results) => {
  debug("total of " + results.length + " results found");
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
    if(results != null && results.length > 0) {
      results.forEach((table) => {
        var ds = table.DataSource + 'Connection';
        models[ds].getQueryInterface().dropTable(table.TableName).then(() => {
          return models.Usage.update({Deleted: true}, {fields: ['Deleted'], where: {id: table.id}});
        }).then(() => {
          console.log(table.TableName + ' on db ' + table.DataSource + ', deleted on ' + today);
        }).catch((err) => {
          console.log("error dropping table ");
        });
      });
    } else {
      console.log("No tables to delete on " + today);
    }
}).catch((err) => {
  console.log("error while syncing db for table cleaner: " + err);
});
