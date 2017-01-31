'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(module.filename);
var env       = process.env.NODE_ENV || 'development';
var debug     = require('debug');
var configFile;
// to modify when at home or work while in dev
if(env == "work" || env == "production") {
  configFile    = require(__dirname + '/../config/config.prod.json');
} else {
  configFile    = require(__dirname + '/../config/config.json');
}

debug('dirname of models.index at runtime:')
debug(__dirname);

var mysqlConfig = configFile['mysqlTestDB'];
var postgresConfig = configFile['postgresTestDB'];
var mssqlConfig = configFile['mssqlTestDB'];

if(env == 'test') {
  var config = configFile['test'];
  config.logging = false;
  mysqlConfig.logging = false;
  mssqlConfig.logging = false;
  postgresConfig.logging = false;
} else {
  var config = configFile['usage'];
}

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

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.mysqlConnection = mysqlConnection;
db.mssqlConnection = mssqlConnection;
db.postgresConnection = postgresConnection;
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
