var getRandomDataValue = require('./getRandomDataValue');

module.exports = (columns, numberOfRecords) => {
  var data = [];
  // then loop from 0 -> numberOfRecords and create new row following column models
  for(var i = 0; i < numberOfRecords; i++) {
    var row = {};
    columns.forEach(function(column) {
      row[column.fieldName] = column.nextRandomData;
      column.intervalCounter--;
      if( column.intervalCounter < 1 ||
         (column.hierarchy == 'child' && column.dataType != "file" && columns[column.parentIndex].intervalCounter == columns[column.parentIndex].count)) {
          // reset intervalCount, to count if random or expand, to 1 if trending behavior
          column.intervalCounter = (["positive", "negative"].indexOf(column.behavior) < 0) ? column.count : 1;
          if(column.dataType == "file" && column.hierarchy == "parent") {
            column.nextIndex = columns[column.childIndex].nextIndex = Math.floor(Math.random() * column.file.values.length);
          }
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
