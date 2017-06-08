// get random data for a column profile
// take a column model and generate a random value based on data type, maxValue

var logger   = require('./logger').logger;
var addDays = require('date-fns/add_days');
var moment = require("moment");

module.exports = (column) => {
  if(column.allowNulls && Math.random() > .9) {
    return null;
  } else if(column.behavior && ["random", "expand"].indexOf(column.behavior) < 0) {
    // process the behavior and return nextRandomValue incremented
    // first check nextRandomValue's existence,
    // if it doesnt exist, this is the first time running processColumns and setting next random values
    // so set nextRandomValue to min value for all but text, for text : first value == "a" * length ?
    if(column.behavior == "positive") {
      if(column.nextRandomData != null && column.nextRandomData != undefined) {
        if(column.dataType != "date") {
          // return Math.min(column.maxValue, column.nextRandomData + column.count);
          // for now do not limit the next incremented value to the maxValue
          return column.nextRandomData + column.count;
        } else {
          return moment(column.nextRandomData).add(column.count, "days").toISOString();
        }
      } else {
        return column.dataType == "date" ? new Date(column.minValue).toISOString() : column.minValue;
      }
    } else {
      if(column.nextRandomData != null && column.nextRandomData != undefined) {
        if(column.dataType != "date") {
          // return Math.max(column.minValue, column.nextRandomData + column.count);
          // for now do not limit the next incremented value to the minValue
          return column.nextRandomData + column.count;
        } else {
          return moment(column.nextRandomData).add(column.count, "days").toISOString();
        }
      } else {
        return column.dataType == "date" ? new Date(column.maxValue).toISOString() : column.maxValue;
      }
    }
  } else {
    switch(column.dataType) {
      case 'text' :
        // String.fromCharCode()
        // A-Z: 65-90, a-z: 97-122
        var randomString = "";
        // for now strings will all be of length maxValue, so minValue is not used for 'text'
        // could build in randomly selecting length between min and max
        for(var i = 0; i < column.maxValue; i++) {
          var charNumber = Math.random() * (123-65) + 65;
          if(charNumber < 97 && charNumber > 90) {
            charNumber += Math.random() * (20-7) + 7;
          }
          var c = String.fromCharCode(charNumber);
          randomString += c;
        }
        return randomString;
      case 'date' :
        var minDate = new Date(column.minValue);
        var maxDate = new Date(column.maxValue);
        var date = ( Math.random() * ( maxDate.valueOf() - minDate.valueOf() ) ) + minDate.valueOf();
        return new Date(date).toISOString();
      case 'integer' :
        return Math.floor( ( Math.random() * ( column.maxValue + 1 - column.minValue ) ) + column.minValue);
      case 'decimal' :
        return ( Math.random() * ( column.maxValue + 1 - column.minValue ) ) + column.minValue;
      case "file" :
        // grab substring starting at 7th char to remove "Custom " from fieldName - see processColumns.processFileValues
        return column.file.values[column.nextIndex][column.fieldName.substring(7)];
    }
  }
}
