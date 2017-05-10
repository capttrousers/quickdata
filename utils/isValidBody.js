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
    || isNaN(parseInt(body.numberOfRecords, 10))
    || body.columns == null
    || body.columns.length == 0
    || body.dataSource == null
    || body.dataSource.length == 0
    || body.user == null
    || body.user.length == 0
    || body.tableName == null
    || body.tableName.length == 0
  ) {
    return false;
  }
  var isValid = true;
  _.forEach(body.columns, function(column) {
    if(  column.allowNulls == null
      || column.minValue == null
      || column.minValue.length == 0
      || column.maxValue == null
      || column.maxValue.length == 0
      || isNaN(parseInt(column.count, 10))
      || column.dataType == null
      || column.dataType.length == 0
      || column.hierarchy == null
      || column.hierarchy.length == 0
      || column.behavior == null
      || column.behavior.length == 0
    ) {
      isValid = false;
      return false;
    }
    if(column.behavior != "random" && ((column.maxValue - column.minValue) / column.count) < body.numberOfRecords) {
      isValid = false;
      return false;
    }
    if(column.dataType == "date") {
      if(  isNaN(Date.parse(column.minValue))
        || isNaN(Date.parse(column.maxValue))
        || column.minValue.length != 10
        || column.minValue.length != 10
        || column.minValue.match(/-/g) == null
        || column.minValue.match(/-/g).length != 2
        || column.maxValue.match(/-/g) == null
        || column.maxValue.match(/-/g).length != 2
        || new Date(column.minValue).valueOf() > new Date(column.maxValue).valueOf()) {
        // with dataType date, min/max must be dates in ISO: yyyy-mm-dd
        isValid = false;
        return false;
      }
    } else if( isNaN(parseFloat(column.minValue, 10))
      || isNaN(parseFloat(column.maxValue, 10))
      || parseFloat(column.minValue, 10) > parseFloat(column.maxValue, 10)
      || (column.dataType == "text" && parseFloat(column.minValue, 10) < 1) ) {
      isValid = false;
      return false;
    }
  })
  return isValid ;
}
