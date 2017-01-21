var json2csv = require('json2csv');
var fs = require('fs');
var path = require('path');
var express = require('express');
var router = express.Router();

var models = require('./models');
var processColumns = require('./utils/processColumns');
var generateData = require('./utils/generateData');

/* GET home page. test */
router.get('/', function(req, response, next) {
  response.redirect("/index.html")
});

router.post("/quickdata", function(request, response, next) {
	var maxRows = request.body.maxRows;
  // goes up to at least 5 million
  // but for now will limit to 1000 records for in memory bulkInsert db operations
  maxRows = (maxRows <= 10000000 && maxRows > 0 ? maxRows : 50);
	// first loop thru columns, find interval profile for each column
	var columns = processColumns(request.body.columns, maxRows);

	// parse and create json to create / overwrite csv file in public
	// quick_data will be json parsed to csv: json2csv({ data: quick_data, fields: quick_data_fields })
  // quick_date is array of objs, each obj is row of key value pairs
	var quick_data = generateData(columns, maxRows);
  // quick_data_fields is array of column names: column.name
	var quick_data_fields = [];

  columns.forEach((column) => {
      quick_data_fields.push(column.name);
  });


  var user = request.body.user;
  var tableName = request.body.tableName;
  var sfCase =  request.body.sfCase;
  var name = sfCase+ '-' + tableName;
  var dataSource = request.body.dataSource;

  var createdAt = new Date();
  var deleteOn = new Date(createdAt).setMonth(createdAt.getMonth() + 1);

  // models.AppTable.insert new table name, other table transaction info like user, email, sf case, db type
  // then process response, either make and send csv, or create table on db and insert data
  models.Usage.create({
    User: user,
    TableName: name,
    SFCase: sfCase,
    DataSource: dataSource,
    Created: createdAt,
    Delete: deleteOn
  }).then( function() {
      if(dataSource == 'csv') {
      	var csv = json2csv({ data: quick_data, fields: quick_data_fields });
        // created string for csv file. send as response to save on client
        response.status(200).send(csv);
      } else {
        var attrs = {};
        columns.forEach(function(column) {
          var dataType = null;
          var columnName = column.name.replace(' ', '_')
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
          attrs[column.name] = dataType;
        });

        // get proper connection instance of sequelize
        var seq = null;
        switch(dataSource) {
          case 'mssql':
            seq = models.mssqlConnection;
            break;
          case 'postgresql':
            // comment this out when at home
            seq = models.postgresConnection;
            break;
          case 'mysql':
            seq = models.mysqlConnection;
            break;
        }

        seq.getQueryInterface().createTable(
          name,
          attrs
        ).then( function () {
            // values are an array of objects, each object is row with key value pairs
            seq.getQueryInterface().bulkInsert(name, quick_data);
        });

        var connectionText = "";
        connectionText += "This is the connection info for the random data generated\n";
        connectionText += "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n";
        connectionText += "    For Salesforce case # " + sfCase + "  \n\n";
        connectionText += "|     data source type               :       " + dataSource.toUpperCase() + "  \n|\n";
        connectionText += "|     host                           :       " + seq.config.host + " \n";
        connectionText += "|     port                           :       " + seq.config.port + " \n|\n";
        connectionText += "|     database name                  :       " + seq.config.database + " \n";
        connectionText += "|     table name                     :       " + name + " \n|\n";
        connectionText += "|     username of test db            :       " + seq.config.username + " \n";
        connectionText += "|     password of test db            :       " + seq.config.password + " \n|\n";
        connectionText += "|     user requesting random data    :       " + user + " \n";
        connectionText += "|     random data created on         :       " + createdAt.toString();
        response.status(200).send(connectionText);
      }
    });
});

module.exports = router;
