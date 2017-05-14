/*

  this will export a function that takes a single argument, a request body
  w/ all the props and an array of column objects
  and parses the body object and the columns array and checks for all appropriate properties

  @
  returns false if body is not valid
*/

var _ = require('lodash');
var validator = require('validator');

module.exports = (body) => {
  var isValid = "";
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
    isValid = "invalid body metadata";
  }
  _.forEach(body.columns, function(column) {
    if(  column.allowNulls == null
      || column.minValue == null
      || column.minValue.length == 0
      || column.maxValue == null
      || column.maxValue.length == 0
      || column.dataType == null
      || column.dataType.length == 0
      || column.hierarchy == null
      || column.hierarchy.length == 0
      || column.behavior == null
      || column.behavior.length == 0
    ) {
      isValid = "invalid column properties";
      return false;
    }
    /*
    // for now comment this out, the current behavior will be blow past max/min value if trend increment and #ofRecords forces it
    if(column.behavior != "random" && ((column.maxValue - column.minValue) / column.count) < body.numberOfRecords) {
      isValid = false;
      return false;
    }
    */
    if(column.hierarchy != "none" && column.behavior != "random") {
      isValid = "cannot have hiearchy and non random behavior";
      return false;
    }

    if(["positive","negative"].indexOf(column.behavior) >= 0) {
      if(column.dataType == "decimal") {
        if( isNaN(parseFloat(column.count, 10)) ) {
          isValid = "increment must be a float";
          return false;
        }
      } else if(isNaN(parseInt(column.count, 10)) ) {
        isValid = "increment must be an integer";
        return false;
      }
    }

    if(column.dataType == "file" &&
        (column.file == null
        || column.file.values == null
        || column.file.fields == null
        || column.file.fields.length > 2
        || column.file.fields.length < 1
        || column.file.values.length > 50
        || column.file.values.length < 1)
    ) {
      isValid = "invalid file uploaded";
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
        isValid = "invalid date min or max values";
        return false;
      }
    } else if( isNaN(parseFloat(column.minValue, 10))
      || isNaN(parseFloat(column.maxValue, 10))
      || parseFloat(column.minValue, 10) > parseFloat(column.maxValue, 10)
      || (column.dataType == "text" && parseFloat(column.minValue, 10) < 1) ) {
      isValid = "invalid min or max values";
      return false;
    }
  })
  return isValid ;
}
