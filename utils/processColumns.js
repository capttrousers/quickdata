// process columns function
// takes the columns got from the json obj in the http request body
// processes each to add a few attrs, returns new columns array
// adds column name, max value, and first random value

var getRandomDataValue = require('./getRandomDataValue');

// the function can also do appropriate clipping of props
//
// should probably do the same type of validation / reactive behavior on props / clipping as on client side

module.exports = (bodyColumns, numberOfRecords) => {
  var fields = bodyColumns;
  // # of columns for each datatype for column names:
  var textColumnCount = decColumnCount = intColumnCount = dateColumnCount = 1;
  var columns = [];

  fields.forEach(function(bodyColumn) {
    var column = processColumn(bodyColumn, numberOfRecords);
    column.nextRandomData = getRandomDataValue(column);
    columns.push(column);
    // handle child column
    if(column.hierarchy == 'parent') {
      var child = processColumn(column.child, numberOfRecords);
      /*
          parentIndex and childIndex can be collapsed to hierarchy maybe
          check where hierarchy is used to see if it can be inferred from the indices existence
      */
      child.parentIndex = columns.indexOf(column);
      child.minValue = new Date(column.nextRandomData);
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
    column.interval = Math.max(1, column.interval);
    column.interval = Math.min(column.interval, column.numberOfRecords);
    column.intervalCounter = column.interval;
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
        // date max value is actually minValue date value
        column.maxValue = new Date(column.maxValue);
        column.minValue = new Date(column.minValue);
        dateColumnCount++;
        break;
      default :
        column.maxValue = (0 < column.maxValue && column.maxValue <= 1000000
                                    ? column.maxValue : 1000000 );
        // minValue of 0 for numbers, can change to be min int
        column.minValue = Math.max(column.minValue, 0);
        if(column.dataType ==  'integer') {
          column.name = "Integer column " + intColumnCount;
          intColumnCount++;
        } else if(column.dataType == 'decimal') {
          column.name = "Decimal column " + decColumnCount;
          decColumnCount++;
        }
        break;
    }
    return column;
  }
}
