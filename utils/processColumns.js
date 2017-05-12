// process columns function
// takes the columns got from the json obj in the http request body
// processes each to add a few attrs, returns new columns array
// adds column.fieldName, max value, and first random value

var getRandomDataValue = require('./getRandomDataValue');

// the function can also do appropriate clipping of props
//
// should probably do the same type of validation / reactive behavior on props / clipping as on client side

var logger   = require('../utils/logger').logger;

module.exports = (bodyColumns, numberOfRecords) => {
  var fields = bodyColumns;
  // # of columns for each datatype for column.fieldNames:
  var textColumnCount = decColumnCount = intColumnCount = dateColumnCount = 1;
  var columns = [];

  fields.forEach(function(bodyColumn) {
    var column = processColumn(bodyColumn, numberOfRecords);
    column.nextRandomData = getRandomDataValue(column);
    columns.push(column);
    // handle child column
    if(column.hierarchy == 'parent') {
      // if file dataType, no need to process child column
      var child = processColumn(column.child, numberOfRecords);
      /*
          parentIndex and childIndex can be collapsed to hierarchy maybe
          check where hierarchy is used to see if it can be inferred from the indices existence
      */
      child.parentIndex = columns.indexOf(column);
      if(column.dataType == "date") {
        var maxValue = Math.max(column.maxValue, child.maxValue);
        child.maxValue = new Date(maxValue);
        child.minValue = new Date(column.nextRandomData);
        // set parent column maxvalue,
        // this might not be needed if filtering invalid min/max on children
        columns[child.parentIndex].maxValue = maxValue;
      }

      child.nextRandomData = getRandomDataValue(child);
      columns.push(child);
      // then set parent's childIndex = to index of new column child
      columns[child.parentIndex].childIndex = columns.indexOf(child);
    }
  });

  return columns;

  // take column, add a few attrs and push column.fieldName to quick_data_fields
  function processColumn(column, numberOfRecords) {
    column.numberOfRecords = numberOfRecords;
    switch (column.dataType) {
      case 'text' :
        column.fieldName = "Text column " + textColumnCount;
        // max of 1000 chars for strings, for now
        column.maxValue = Math.min(column.maxValue, 1000);
        // minValue of 1 char
        column.minValue = Math.max(column.minValue, 1);
        textColumnCount++;
        break;
      case 'date' :
        column.fieldName = "Date column " + dateColumnCount;
        column.maxValue = (column.maxValue) ? new Date(column.maxValue) :  new Date();
        //  default min date of jan 1 2001
        column.minValue = (column.minValue) ? new Date(column.minValue) : new Date("2000-01-01");
        dateColumnCount++;
        break;
      case "decimal" :
      case "integer" :
        // for ints or decimals, max value set to
        column.maxValue = Math.min(column.maxValue, 1000000);
        // minValue of 0 for numbers, can change to be min int
        column.minValue = Math.max(column.minValue, -1000000);
        if(column.dataType ==  'integer') {
          column.fieldName = "Integer column " + intColumnCount;
          intColumnCount++;
        } else if(column.dataType == 'decimal') {
          column.fieldName = "Decimal column " + decColumnCount;
          decColumnCount++;
        }
        break;
      case "file" :
        if(column.hierarchy == "none") { // if processing child, just set intervalCounter
          column = processFileValues(column);
        }
        break;
    }
    if(column.behavior == "random" || column.behavior == "expand") {
      column.count = Math.max(1, column.count);
      column.count = Math.min(column.count, column.numberOfRecords);
      column.intervalCounter = column.count;
    } else if(column.behavior == "negative" || column.behavior == "positive") {
      /* 
        // FOR NOW DO NOT LIMIT COUNT, just let trending increments blow past min/max values
        
        // limit the count to the min between the abs value of the count and the max value allowed for the range btwn max and min / # of records
        var rangeInDays = ((column.maxValue - column.minValue) / 365 / 24 / 60 / 60 / 1000 );
        var range = (column.dataType == "date") ? rangeInDays : column.maxValue - column.minValue;
        column.count = Math.min(Math.abs(column.count), Math.floor(range / column.numberOfRecords));
      */
      if(column.behavior == "positive") {
        column.count = Math.max(Math.abs(column.count), 1);
      } else {
        column.count = Math.min(-1 * Math.abs(column.count), -1);
      }
      column.intervalCounter = 1;
    }
    return column;
  }

  
  function processFileValues(column) {
    // when getting new random value, set nextIndex to be index of values row
    // set nextIndex of parent/child 0 for first value
    column.nextIndex = Math.floor(Math.random() * column.file.values.length);
    // need to figure if file value list has one or two columns
    if(column.file.fields.length == 2) {
      column.child = JSON.parse(JSON.stringify(column));
      column.hierarchy = "parent";
      column.child.hierarchy = "child";
      // process file values to find parent and child fieldNames
      var columnOneFieldName = column.file.fields[0];
      var columnTwoFieldName = column.file.fields[1];
      var columnOneCountD = columnTwoCountD = 0;
      var columnOneValues = columnTwoValues = [];
      column.file.values.forEach((row) => {
        if(! columnOneValues.includes(row[columnOneFieldName])) {
          columnOneCountD++;
          columnOneValues.push(row[columnOneFieldName]);
        }
        if(! columnTwoValues.includes(row[columnTwoFieldName])) {
          columnTwoCountD++;
          columnTwoValues.push(row[columnTwoFieldName]);
        }
      });
      // now we know which column has more varied data values
      // we will put the one with more variation as parent
      if(columnOneCountD > columnTwoCountD) {
        column.child.fieldName = column.file.fields[1];
        column.fieldName = column.file.fields[0]; 
      } else {
        column.child.fieldName = column.file.fields[0];
        column.fieldName = column.file.fields[1]; 
      }
    } else {  // for now assume file.fields is only one or two columns wide
      column.fieldName = column.file.fields[0];
    }
    
    return column;
  }
  
}
