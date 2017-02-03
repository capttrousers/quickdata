'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(module.filename);
var env       = process.env.NODE_ENV || 'development';
var logging   = require('../utils/logger');
var logger    = logging.logger;

var configFile;
// to modify when at home or work while in dev
if(env == "work" || env == "production") {
  configFile    = require(__dirname + '/../config/config.prod.json');
} else {
  configFile    = require(__dirname + '/../config/config.json');
}

logger.debug('dirname of models.index at runtime:')
logger.debug(__dirname);

var mysqlConfig = configFile['mysqlTestDB'];
var postgresConfig = configFile['postgresTestDB'];
var mssqlConfig = configFile['mssqlTestDB'];

if(env == 'test') {
  logger.add(logging.winston.transports.File, {name: 'tests', filename: path.join(__dirname, '../test/tests.log')} );
  logger.remove(logging.winston.transports.Console);
  var config = configFile['test'];
} else {
  var config = configFile['usage'];
}
config.logging = logger.info;
mysqlConfig.logging = logger.info;
mssqlConfig.logging = logger.info;
postgresConfig.logging = logger.info;
logger.debug("config file %o", config);

var sequelize = new Sequelize(config.database, config.username, config.password, config);
var mysqlConnection = new Sequelize(mysqlConfig.database, mysqlConfig.username, mysqlConfig.password, mysqlConfig);
var postgresConnection = new Sequelize(postgresConfig.database, postgresConfig.username, postgresConfig.password, postgresConfig);
var mssqlConnection = new Sequelize(mssqlConfig.database, mssqlConfig.username, mssqlConfig.password, mssqlConfig);


var db        = {};

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(function(file) {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });
// dont have any associations
// Object.keys(db).forEach(function(modelName) {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

db.mysqlConnection = mysqlConnection;
db.mssqlConnection = mssqlConnection;
db.postgresConnection = postgresConnection;
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
