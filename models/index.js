'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(module.filename);
var env       = process.env.NODE_ENV || 'development';
var configFile    = require(__dirname + '/../config/config.json');
var db        = {};

var config = configFile[env];
if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  var mysqlConfig = configFile['mysqlTestDB'];
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
  var mysqlConnection = new Sequelize(mysqlConfig.database, mysqlConfig.username, mysqlConfig.password, mysqlConfig);
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
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
