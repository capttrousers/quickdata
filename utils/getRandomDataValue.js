// get random data for a column profile
// take a column model and generate a random value based on data type, maxValue

var logger   = require('./logger').logger;

module.exports = (column) => {
     switch(column.dataType) {
      case 'text' :
        // String.fromCharCode()
        // A-Z: 65-90, a-z: 97-122
        var randomString = "";
        // for now strings will all be of length maxValue
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
     }
}
