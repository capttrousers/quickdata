// process columns function
// takes the columns got from the json obj in the http request body
// processes each to add a few attrs, returns new columns array
// adds column name, max value, and first random value

var getRandomDataValue = require('./getRandomDataValue');

// the function can also do appropriate clipping of props
//
// should probably do the same type of validation / reactive behavior on props / clipping as on client side

var logger   = require('../utils/logger').logger;

module.exports = (bodyColumns, numberOfRecords) => {
  var fields = bodyColumns;
  // # of columns for each datatype for column names:
  var textColumnCount = decColumnCount = intColumnCount = dateColumnCount = 1;
  var columns = [];

  fields.forEach(function(bodyColumn) {
    var column = processColumn(bodyColumn, numberOfRecords);
    if(column.trend == "random") {
      column.nextRandomData = getRandomDataValue(column);
    }
    columns.push(column);
    // handle child column
    if(column.hierarchy == 'parent') {
      var child = processColumn(column.child, numberOfRecords);
      /*
          parentIndex and childIndex can be collapsed to hierarchy maybe
          check where hierarchy is used to see if it can be inferred from the indices existence
      */
      child.parentIndex = columns.indexOf(column);
      if(column.dataType == "date") {
        var maxValue = Math.max(column.maxValue, child.maxValue);
        child.maxValue = maxValue;
        child.minValue = new Date(column.nextRandomData);
        // set parent column maxvalue
        columns[child.parentIndex].maxValue = maxValue;
      }

      child.nextRandomData = getRandomDataValue(child);
      columns.push(child);
      // then set parent's childIndex = to index of new column child
      columns[child.parentIndex].childIndex = columns.indexOf(child);
    }
  });

  return columns;

  // take column, add a few attrs and push column.name to quick_data_fields
  function processColumn(column, numberOfRecords) {
    column.numberOfRecords = numberOfRecords;
    switch (column.dataType) {
      case 'text' :
        column.name = "Text column " + textColumnCount;
        // max of 1000 chars for strings, for now
        column.maxValue = Math.min(column.maxValue, 1000);
        // minValue of 1 char
        column.minValue = Math.max(column.minValue, 1);
        textColumnCount++;
        break;
      case 'date' :
        column.name = "Date column " + dateColumnCount;
        column.maxValue = (column.maxValue) ? new Date(column.maxValue) :  new Date();
        //  default min date of jan 1 2001
        column.minValue = (column.minValue) ? new Date(column.minValue) : new Date("2000-01-01");
        dateColumnCount++;
        break;
      default :
        // for ints or decimals, max value set to
        column.maxValue = Math.min(column.maxValue, 1000000);
        // minValue of 0 for numbers, can change to be min int
        column.minValue = Math.max(column.minValue, -1000000);
        if(column.dataType ==  'integer') {
          column.name = "Integer column " + intColumnCount;
          intColumnCount++;
        } else if(column.dataType == 'decimal') {
          column.name = "Decimal column " + decColumnCount;
          decColumnCount++;
        }
        break;
    }
    column.interval = Math.max(1, column.interval);
    column.interval = Math.min(column.interval, column.numberOfRecords);
    if(column.hierarchy != "none") {
      column.trend = "random";
    }
    if(column.trend != "random") {
      column.interval = 1;
      // limit the increment to the min between the abs value of the increment and the max increment value allowed for the range btwn max and min / # of records
      var rangeInDays = ((column.maxValue - column.minValue) / 365 / 24 / 60 / 60 / 1000 );
      var range = (column.dataType == "date") ? rangeInDays : column.maxValue - column.minValue;
      column.increment = Math.min(Math.abs(column.increment), Math.floor(range / column.numberOfRecords));
      if(column.trend == "positive") {
        column.increment = Math.max(column.increment, 1);
        column.nextRandomData = column.dataType == "date" ? new Date(column.minValue).toISOString() : column.minValue;
      } else {
        column.increment = Math.min(-1 * column.increment, -1);
        column.nextRandomData = column.dataType == "date" ? new Date(column.maxValue).toISOString() : column.maxValue;
      }
    }
    column.intervalCounter = column.interval;
    return column;
  }
}
