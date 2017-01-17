var json2csv = require('json2csv');
var fs = require('fs');
var path = require('path');
var express = require('express');
var router = express.Router();

var models = require('./models');

/* GET home page. */
router.get('/', function(req, response, next) {
  response.redirect("/index.html")
});

router.post("/quickdata", function(request, response, next) {
	var maxRows = request.body.maxRows;
  // goes up to at least 5 million
  // but for now will limit to 1000 records for in memory bulkInsert db operations
  maxRows = (maxRows <= 10000000 && maxRows > 0 ? maxRows : 50);
	var bodyColumns = request.body.columns;

	// parse and create json to create / overwrite csv file in public
	// quick_data will be json parsed to csv: json2csv({ data: quick_data, fields: quick_data_fields })
  // quick_date is array of objs, each obj is row of key value pairs
	var quick_data = [];
  // quick_data_fields is array of column names: column.name
	var quick_data_fields = [];

	// first loop thru columns, find interval profile for each column
	// 1 <= interval <= maxRows

	// # of columns for each datatype for column names:
	var textColumnCount = decColumnCount = intColumnCount = dateColumnCount = 1;
	var columns = [];

	bodyColumns.forEach(function(bodyColumn) {
		processColumn(bodyColumn);
    // handle child column
    if(bodyColumn.hierarchy == 'parent') {
      var child = bodyColumn.child;
      child.parentIndex = columns.indexOf(bodyColumn);
      processColumn(child);
    }
	});

  // take column, add a few attrs and push column.name to quick_data_fields
  function processColumn(column) {
    column.interval = (1 <= column.interval && column.interval <= maxRows
                                ? column.interval : 1);
		column.intervalCounter = column.interval;
		if(column.dataType === 'date') {
			// date max value is actually min date value
			column.maxValue = new Date(column.maxValue);
		} else {
			column.maxValue = (0 < column.maxValue && column.maxValue <= 1000000
                                    ? column.maxValue : 1000000 );
		}
		switch (column.dataType) {
			case 'text' :
				column.name = "Text column " + textColumnCount;
				textColumnCount++;
				column.maxValue = Math.min(column.maxValue, 10);
				break;
			case 'date' :
				column.name = "Date column " + dateColumnCount;
				dateColumnCount++;
				break;
			case 'integer' :
				column.name = "Integer column " + intColumnCount;
				intColumnCount++;
				break;
			case 'decimal' :
				column.name = "Decimal column " + decColumnCount;
				decColumnCount++;
				break;
		}
		column.nextRandomData = getRandomData(column);
		columns.push(column);
		quick_data_fields.push(column.name);
  }

	// then loop from 0 -> maxRows and create new row following column models
	for(var i = 0; i < maxRows; i++) {
		var row = {};
		columns.forEach(function(column) {
			row[column.name] = column.nextRandomData;
			column.intervalCounter--;
			if(column.intervalCounter < 1 ||
        (column.hierarchy == 'child' && columns[column.parentIndex].intervalCounter == columns[column.parentIndex].interval)) {
  				column.intervalCounter = column.interval;
  				column.nextRandomData = getRandomData(column);
			}
		});
		quick_data.push(row);
	}

  // take a column model and generate a random value based on data type, maxValue
	function getRandomData (column) {
	   switch(column.dataType) {
			case 'text' :
		    // String.fromCharCode()
				// A-Z: 65-90, a-z: 97-122
				var randomString = "";
				for(var i = 0; i < column.maxValue; i++) {
					var charNumber = Math.random() * (123-65) + 65;
					if(charNumber < 97 && charNumber > 90) {
						charNumber += Math.random() * (20-7) + 7;
					}
					var c = String.fromCharCode(charNumber);
					randomString += c;
				}
				return randomString;
			case 'date' :
				var minDate = new Date(column.maxValue);
				var date = ((new Date() - minDate.valueOf()) * Math.random()) + minDate.valueOf();
				return new Date(date).toISOString();
			case 'integer' :
				return Math.floor(Math.random() * (column.maxValue + 1));
			case 'decimal' :
				return Math.random() * column.maxValue;
	   }
   }

  var user = request.body.user;
  var tableName = request.body.tableName;
  var sfCase =  request.body.sfCase;
  var name = sfCase+ '-' + tableName;
  var dataSource = request.body.dataSource;

  var createdAt = new Date();

  var deleteOn = new Date(createdAt).setMonth(createdAt.getMonth() + 1);
  models.Usage.create({
    User: user,
    TableName: name,
    SFCase: sfCase,
    DataSource: dataSource,
    Created: createdAt,
    Delete: deleteOn
  }).then( function() {

      // models.AppTable.insert new table name, other table transaction info like user, email, sf case, db type
      // then process response, either make and send csv, or create table on db and insert data

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
        models.mysqlConnection.getQueryInterface().createTable(
          name,
          attrs
        );
        var connectionText = "";
        connectionText += "This is the connection info for the random data generated\n";
        connectionText += "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n";
        connectionText += "|  For Salesforce case # " + sfCase + "  \n|\n";
        connectionText += "|     data source connection       :   " + dataSource.toUpperCase() + "  \n";
        connectionText += "|     database name                :   " + models.mysqlConnection.config.database + " \n";
        connectionText += "|     host                         :   " + models.mysqlConnection.config.host + " \n";
        connectionText += "|     port                         :   " + models.mysqlConnection.config.port + " \n|\n";
        connectionText += "|     username of test db          :   " + models.mysqlConnection.config.username + " \n";
        connectionText += "|     password of test db          :   " + models.mysqlConnection.config.password + " \n|\n";
        connectionText += "|     user requesting random data  :   " + user + " \n";
        connectionText += "|     random data created on       :   " + createdAt.toString() + " \n";
        response.status(200).send(connectionText);
      }
    });

  /*
	// use path.resolve() here?
	fs.writeFile(__dirname + '/quickData.csv', csv, function(err) {
		if (err) throw err;
		console.log('file saved');
		// send success code to redirect client to url path of new csv file
		response.status(200).end();
	});
  */
});

module.exports = router;
