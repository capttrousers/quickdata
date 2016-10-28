var json2csv = require('json2csv');
var fs = require('fs');
var path = require('path');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, response, next) {
  response.redirect("http://localhost:3001/index.html")
});

router.post("/quickdata", function(request, response, next) {
	var maxRows = request.body.maxRows;
	var bodyColumns = request.body.columns;

	// parse and create json to create / overwrite csv file in public
	// quick_data will be json parsed to csv: json2csv({ data: quick_data, fields: quick_data_fields })
	var quick_data = [];
	var quick_data_fields = [];
	// first loop thru columns, find randomness profile for each column, calculate interval
	// 1 <= randomness <= maxRows
	// # of columns for each datatype for column names:
	var textColumnCount = decColumnCount = intColumnCount = dateColumnCount = 1;
	var columns = [];
	bodyColumns.forEach(function(bodyColumn) {
		bodyColumn.randomness = (1 < bodyColumn.randomness && bodyColumn.randomness <= maxRows ? bodyColumn.randomness : maxRows);
		bodyColumn.interval = Math.floor(maxRows / bodyColumn.randomness);
		bodyColumn.intervalCounter = bodyColumn.interval;
		bodyColumn.maxValue = (0 < bodyColumn.maxValue && bodyColumn.maxValue <= 1000000 ? bodyColumn.maxValue : 1000000 );
		switch (bodyColumn.datatype) {
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
   
	var getRandomData = function(column) {
	   switch(column.datatype) {
			case 'text' :			
			    // String.fromCharCode()
				// A-Z: 65-90, a-z: 97-122
				var randomData = "";
				for(var i = 0; i < maxValue; i++) {
					var charNumber = Math.random() * (123-65) + 65;
					if(charNumber < 97 && charNumber > 90) {
						charNumber += Math.random() * (20-7) + 7;
					}
					var c = String.fromCharCode(charNumber);
					randomData += c;
				}				
				return randomData;
			case 'date' :
				return new Date( new Date() - (Math.random() * new Date()));
			case 'int' :
				return Math.floor(Math.random() * (column.maxValue + 1));
			case 'decimal' :
				return Math.random() * (column.maxValue + 1);
	   }
   }
   
	var fields = ['car.make', 'car.model', 'price', 'color'];
	var myCars = [
		{
			"car": {"make": "Audi", "model": "A3"},
			"price": 40000,
			"color": "blue"
		}, {
			"car": {"make": "BMW", "model": "F20"},
			"price": 35000,
			"color": "black"
		}, {
			"car": {"make": "Porsche", "model": "9PA AF1"},
			"price": 60000,
			"color": "green"
		}
	];
	// var csv = json2csv({ data: myCars, fields: fields });
	
	var csv = json2csv({ data: quick_data, fields: quick_data_fields });

	// use path.resolve() here!!!!
	fs.writeFile(__dirname + '/public/quickData.csv', csv, function(err) {
		if (err) throw err;
		console.log('file saved');
		// send csv file
		response.status(200).end();
	});
});

module.exports = router;
