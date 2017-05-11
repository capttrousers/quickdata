var json2csv = require('json2csv');
var fs = require('fs');
var path = require('path');
var express = require('express');
var router = express.Router();
var _ = require('lodash');

var logger   = require('../utils/logger').logger;

var models = require('../models');
var processColumns = require('../utils/processColumns');
var generateData = require('../utils/generateData');
var isValidBody = require('../utils/isValidBody');

var testing   = process.env.NODE_TESTING || false;

/* GET home page. test */
router.get('/', function(request, response, next) {
  response.type('html').sendFile("/index.html");
});

router.post("/quickdata", function(request, response, next) {
  if( ! isValidBody(request.body) ) {
    logger.info('bad request (400), body property is missing something')
    response.status(400).type('json').send({error: 'request body missing something'});
  } else {
    next();
  }
});

router.post("/quickdata", function(request, response, next) {
  logger.info('POST /quickdata recieved a valid request body')
	var numberOfRecords = request.body.numberOfRecords;
  // goes up to at least a million
  // but for now will limit to 100000 records for in memory bulkInsert db operations
  // mssql currently has a limit of 1000 for bulk insert, fixed in sequelize@4.0
  var MAXIMUM_RECORDS = (request.body.dataSource != 'mssql' ? 100000 : 1000);
  numberOfRecords = Math.max(numberOfRecords, 0);
  numberOfRecords = Math.min(numberOfRecords, MAXIMUM_RECORDS);
  request.body.numberOfRecords = (numberOfRecords > 0 ? numberOfRecords : 50);

	// first loop thru columns, find interval profile for each column
	request.body.columns = processColumns(request.body.columns, request.body.numberOfRecords);
  request.body.tableName = request.body.sfCase + '_' + request.body.tableName;

  // create table attributes object here to check against any existing tables
  request.body.attributes = {};
  request.body.columns.forEach(function(column) {
    var dataType = null;
    switch (column.dataType) {
      case 'text' :
        dataType = models.Sequelize.STRING;
        break;
      case 'date' :
        dataType = models.Sequelize.DATE;
        break;
      case 'integer' :
        dataType = models.Sequelize.INTEGER;
        break;
      case 'decimal' :
        dataType = models.Sequelize.DOUBLE;
        break;
    }
    request.body.attributes[column.fieldName] = dataType;
  });

  // check existing tables for same schema
  if(request.body.dataSource != 'csv') {
    models[request.body.dataSource + "Connection"].getQueryInterface().describeTable(request.body.tableName).then((attrs) => {
      logger.info('attrs keys length ', Object.keys(attrs).length);
      if(! _.isEqual(Object.keys(request.body.attributes).sort(), Object.keys(attrs).sort()) ) {
        logger.info('schemas are not the same after describe table');
        return response.status(400).type('json').send({error: 'table exists with a schema incompatible with request'});
      } else {
        logger.info('schemas are the same, skip to generate data and append');
        return next();
      }
    }).catch(() => {
      logger.info('the table doesnt exist, skip to generate data');
      return next();
    })
  } else {
    logger.info('data source is csv, so dont check dbs, skip to generate data');
    next();
  }
});


router.post("/quickdata", function(request, response, next) {
  logger.info('POST /quickdata recieved request with a new or valid existing table or csv file');
	// parse and create json to create / overwrite csv file in public
	// quick_data will be json parsed to csv: json2csv({ data: quick_data, fields: quick_data_fields })
  // quick_date is array of objs, each obj is row of key value pairs
	var quick_data = generateData(request.body.columns, request.body.numberOfRecords);
  logger.info("Generate data successful");


  // quick_data_fields is array of column names: column.fieldName
	var quick_data_fields = [];
  request.body.columns.forEach((column) => {
      quick_data_fields.push(column.fieldName);
      logger.debug("column interval = %s", column.interval);
      logger.debug('column.interval is typeof ' + typeof column.interval);
  });

  var createdAt = new Date();
  var deleteOn = new Date(createdAt);
  if(! testing ) {
    deleteOn.setMonth(createdAt.getMonth() + 1);
  }

  // models.AppTable.insert new table name, other table transaction info like user, email, sf case, db type
  // then process response, either make and send csv, or create table on db and insert data
  models.Usage.create({
    User: request.body.user,
    TableName: request.body.tableName,
    SFCase: request.body.sfCase,
    DataSource: request.body.dataSource,
    Created: createdAt,
    DeleteOn: deleteOn
  }).then( function() {
    logger.info("Created log entry in Usage table");
    if(request.body.dataSource == 'csv') {
    	var csv = json2csv({ data: quick_data, fields: quick_data_fields });
      // created string for csv file. send as response to save on client
      response.status(200).type('text').send(csv);
    } else {
      // get proper connection instance of sequelize
      var seq = null;
      switch(request.body.dataSource) {
        case 'mssql':
          seq = models.mssqlConnection;
          break;
        case 'postgres':
          // comment this out when at home
          seq = models.postgresConnection;
          break;
        case 'mysql':
          seq = models.mysqlConnection;
          break;
      }
      seq.authenticate().then(() => {
        return seq.getQueryInterface().createTable(request.body.tableName, request.body.attributes).then( function () {
          // quick_data values are an array of objects, each object is row with key value pairs
          return seq.getQueryInterface().bulkInsert(request.body.tableName, quick_data).then(() => {
            var connectionText = "";
            connectionText += "This is the connection info for the random data generated\n";
            connectionText += "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n";
            connectionText += "    For Salesforce case # " + request.body.sfCase + "  \n\n";
            connectionText += "|     data source type               :       " + request.body.dataSource.toUpperCase() + "  \n|\n";
            connectionText += "|     host                           :       " + seq.config.host + " \n";
            connectionText += "|     port                           :       " + seq.config.port + " \n|\n";
            connectionText += "|     username of test db            :       " + seq.config.username + " \n";
            connectionText += "|     password of test db            :       " + seq.config.password + " \n|\n";
            connectionText += "|     database name                  :       " + seq.config.database + " \n\n";
            connectionText += "|     table name                     :       " + request.body.tableName + " \n|\n";
            connectionText += "|     user requesting random data    :       " + request.body.user + " \n";
            connectionText += "|     random data created on         :       " + createdAt.toString();
            return response.status(200).type('text').send(connectionText);
          }).catch((err) => {
            logger.info('unable to insert into table: ' + err);
          });
        }).catch((err) => {
          logger.info('unable to create table: ' + err);
        });
      }).catch((err) => {
        logger.info('unable to auth: ' + err);
      });
    }
  });

});

module.exports = router;
