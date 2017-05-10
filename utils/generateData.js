var getRandomDataValue = require('./getRandomDataValue');

module.exports = (columns, numberOfRecords) => {
  var data = [];
  // then loop from 0 -> numberOfRecords and create new row following column models
  for(var i = 0; i < numberOfRecords; i++) {
    var row = {};
    columns.forEach(function(column) {
      row[column.name] = column.nextRandomData;
      column.intervalCounter--;
      if( column.intervalCounter < 1 ||
         (column.hierarchy == 'child' && columns[column.parentIndex].intervalCounter == columns[column.parentIndex].count)) {
          column.intervalCounter = column.count;
          column.nextRandomData = getRandomDataValue(column);
          if(column.hierarchy == 'parent' && column.dataType == "date") {
            columns[column.childIndex].minValue = new Date(column.nextRandomData);
          }
      }
    });
    data.push(row);
  }
  return data;
}
