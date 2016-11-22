var json2csv = require('json2csv');
var fs = require('fs');
var path = require('path');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, response, next) {
  response.redirect("/index.html")
});

router.post("/quickdata", function(request, response, next) {
	var maxRows = request.body.maxRows;
  maxRows = (maxRows <= 1000 && maxRows > 0 ? maxRows : 50);
	var bodyColumns = request.body.columns;

	// parse and create json to create / overwrite csv file in public
	// quick_data will be json parsed to csv: json2csv({ data: quick_data, fields: quick_data_fields })
	var quick_data = [];
	var quick_data_fields = [];

	// first loop thru columns, find interval profile for each column
	// 1 <= interval <= maxRows
	
	// # of columns for each datatype for column names:
	var textColumnCount = decColumnCount = intColumnCount = dateColumnCount = 1;
	var columns = [];
	
	bodyColumns.forEach(function(bodyColumn) {
		bodyColumn.interval = (1 <= bodyColumn.interval && bodyColumn.interval <= maxRows
                                ? bodyColumn.interval : 1);
		bodyColumn.intervalCounter = bodyColumn.interval;
		if(bodyColumn.dataType === 'date') {
			// date max value is actually min date value
			bodyColumn.maxValue = new Date(bodyColumn.maxValue);
		} else {
			bodyColumn.maxValue = (0 < bodyColumn.maxValue && bodyColumn.maxValue <= 1000000
                                    ? bodyColumn.maxValue : 1000000 );
		}
		switch (bodyColumn.dataType) {
			case 'text' :
				bodyColumn.name = "Text column " + textColumnCount;
				textColumnCount++;
				bodyColumn.maxValue = Math.min(bodyColumn.maxValue, 10);
				break;
			case 'date' :
				bodyColumn.name = "Date column " + dateColumnCount;
				dateColumnCount++;
				break;
			case 'int' :
				bodyColumn.name = "Integer column " + intColumnCount;
				intColumnCount++;
				break;
			case 'decimal' :
				bodyColumn.name = "Decimal column " + decColumnCount;
				decColumnCount++;
				break;
		}
		bodyColumn.nextRandomData = getRandomData(bodyColumn);
		columns.push(bodyColumn);
		quick_data_fields.push(bodyColumn.name);
	});

	// then loop from 0 -> maxRows and create new row following column models
	for(var i = 0; i < maxRows; i++) {
		var row = {};
		columns.forEach(function(column) {
			row[column.name] = column.nextRandomData;
			column.intervalCounter--;
			if(column.intervalCounter < 1) {
				column.intervalCounter = column.interval;
				column.nextRandomData = getRandomData(column);
			}
		});
		quick_data.push(row);
	}

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
				return new Date(date).toString();
			case 'int' :
				return Math.floor(Math.random() * (column.maxValue + 1));
			case 'decimal' :
				return Math.random() * (column.maxValue + 1);
	   }
   }

	var csv = json2csv({ data: quick_data, fields: quick_data_fields });

	// use path.resolve() here?
	fs.writeFile(__dirname + '/quickData.csv', csv, function(err) {
		if (err) throw err;
		console.log('file saved');
		// send success code to redirect client to url path of new csv file
		response.status(200).end();
	});
});

module.exports = router;
