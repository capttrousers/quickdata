var getRandomDataValue = require('./getRandomDataValue');

module.exports = (columns, maxRows) => {
  var data = [];
  // then loop from 0 -> maxRows and create new row following column models
  for(var i = 0; i < maxRows; i++) {
    var row = {};
    columns.forEach(function(column) {
      row[column.name] = column.nextRandomData;
      column.intervalCounter--;
      if( column.intervalCounter < 1 ||
         (column.hierarchy == 'child' && columns[column.parentIndex].intervalCounter == columns[column.parentIndex].interval)) {
          column.intervalCounter = column.interval;
          column.nextRandomData = getRandomDataValue(column);
      }
    });
    data.push(row);
  }
  return data;
}
