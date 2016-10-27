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
  var maxval = request.body.maxRows;
  var length = request.body.columns.length;
  console.log("max value = " + maxval);
  console.log("number of columns = " + length);

  var bodyColumns = request.body.columns;
  // parse and create json to create / overwrite csv file in public
  // quick_data will be json parsed to csv: json2csv({ data: quick_data, fields: quick_data_fields })
  // will also need to create quick_data_fields when creating column model
  var quick_data = [];
  /*
   * have maxRows, data profile of each column:
   *  data profile:
		  datatype
          max value: to use in row creation to limit value
   *      randomness prop: will need to use to calculate an interval to change value compared to index

   */

  // first loop thru columns, find randomness profile for each column, calculate interval
  // 1 <= randomness <= maxRows
  // # of columns for each datatype for column names:
  var textColumnCount = decColumnCount = intColumnCount = dateColumnCount = 1;
  var columns = [];
  /* each column in : {
		interval = FLOOR(maxRows / randomness)
		datatype
		intervalCounter = interval // to be decremented once per record : counter--, reset to interval if < 1
		maxvalue : maxValue
		name : [datatype] + "-" + 
    }
   */
   // then loop from 0 -> maxRows and create new row following column models

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
  var csv = json2csv({ data: myCars, fields: fields });
  // var csv = json2csv({ data: quick_data, fields: quick_data_fields });

  // use path.resolve() here!!!!
  fs.writeFile(__dirname + '/public/quickData.csv', csv, function(err) {
    if (err) throw err;
    console.log('file saved');
    // send csv file
    response.status(200).end();
  });
});

module.exports = router;
