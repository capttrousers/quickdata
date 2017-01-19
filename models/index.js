'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(module.filename);
var env       = process.env.NODE_ENV || 'development';
// var configHome    = require(__dirname + '/../config/config.json');
var configWork    = require(__dirname + '/../config/config.work.json');
var db        = {};

// to modify when at home or work while in dev
var configFile = configWork;

var config = configFile[env];

if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  var mysqlConfig = configFile['mysqlTestDB'];
  var postgresConfig = configFile['postgresTestDB'];
  var mssqlConfig = configFile['mssqlTestDB'];

  var sequelize = new Sequelize(config.database, config.username, config.password, config);
  var mysqlConnection = new Sequelize(mysqlConfig.database, mysqlConfig.username, mysqlConfig.password, mysqlConfig);
  var postgresConnection = new Sequelize(postgresConfig.database, postgresConfig.username, postgresConfig.password, postgresConfig);
  var mssqlConnection = new Sequelize(mssqlConfig.database, mssqlConfig.username, mssqlConfig.password, mssqlConfig);
}

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
