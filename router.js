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

  // parse and create json to create / overwrite csv file in public
  var quick_data = [];
  /*
   * have maxRows, data profile of each column:
   *  data profile:
          max value: to use in row creation to limit value
   *      randomness prop: will need to use to calculate an interval to change value compared to index

   */

  // first loop thru columns, find randomness profile for each column, calculate interval
  // 1 <= randomness <= maxRows


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
  var csv = json2csv({ data: myCars, fields: fields });

  // use path.resolve() here!!!!
  fs.writeFile(__dirname + '/public/quickData.csv', csv, function(err) {
    if (err) throw err;
    console.log('file saved');
    // send csv file
    response.status(200).end();
  });
});

module.exports = router;
