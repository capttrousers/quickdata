// process columns function
// takes the columns got from the json obj in the http request body
// processes each to add a few attrs, returns new columns array

var getRandomDataValue = require('./getRandomDataValue');

module.exports = (bodyColumns, maxRows) => {
  var fields = bodyColumns;
  // # of columns for each datatype for column names:
  var textColumnCount = decColumnCount = intColumnCount = dateColumnCount = 1;
  var columns = [];

  fields.forEach(function(bodyColumn) {
    var column = processColumn(bodyColumn, maxRows);
    columns.push(column);
    // handle child column
    if(bodyColumn.hierarchy == 'parent') {
      var child = bodyColumn.child;
      child.parentIndex = columns.indexOf(bodyColumn);
      child = processColumn(child, maxRows);
      columns.push(child);
    }
  });

  return columns;

  // take column, add a few attrs and push column.name to quick_data_fields
  function processColumn(column, maxRows) {
    column.interval = (1 <= column.interval && column.interval <= maxRows
                                ? column.interval : 1);
    column.intervalCounter = column.interval;
    switch (column.dataType) {
      case 'text' :
        column.name = "Text column " + textColumnCount;
        column.maxValue = Math.min(column.maxValue, 10);
        textColumnCount++;
        break;
      case 'date' :
        column.name = "Date column " + dateColumnCount;
        // date max value is actually min date value
        column.maxValue = new Date(column.maxValue);
        dateColumnCount++;
        break;
      default :
        column.maxValue = (0 < column.maxValue && column.maxValue <= 1000000
                                    ? column.maxValue : 1000000 );
        if(column.dataType ==  'integer') {
          column.name = "Integer column " + intColumnCount;
          intColumnCount++;
        } else if(column.dataType == 'decimal') {
          column.name = "Decimal column " + decColumnCount;
          decColumnCount++;
        }
        break;
    }
    column.nextRandomData = getRandomDataValue(column);
    return column;
  }
}
