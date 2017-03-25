/*

  this will export a function that takes a single argument, a request body
  w/ all the props and an array of column objects
  and parses the body object and the columns array and checks for all appropriate properties

  @
  returns false if body is not valid
*/

var _ = require('lodash');
module.exports = (body) => {
  if( ( ! body )
    || body == null
    || body.numberOfRecords == null
    || body.numberOfRecords.length == 0
    || body.columns == null
    || body.columns.length == 0
    || body.dataSource == null
    || body.dataSource.length == 0
    || body.user == null
    || body.user.length == 0
    || body.tableName == null
    || body.tableName.length == 0
    || body.sfCase == null
    || body.sfCase.length == 0
  ) {
    return false;
  }
  var b = true;
  _.forEach(body.columns, function(column) {
    if(  column.allowNulls == null
      || column.minValue == null
      || column.minValue.length == 0
      || column.maxValue == null
      || column.maxValue.length == 0
      || column.interval == null
      || column.interval.length == 0
      || column.increment == null
      || column.increment.length == 0
      || column.dataType == null
      || column.dataType.length == 0
      || column.hierarchy == null
      || column.hierarchy.length == 0
      || column.trend == null
      || column.trend.length == 0
      || column.behavior == null
      || column.behavior.length == 0
    ) {
      b = false;
    }
  })
  return b;
}
