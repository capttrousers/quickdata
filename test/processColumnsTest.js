/*
    this files is to test the process columns function

    this function will take an array of column objects and turn it into an array of data generator objects to use in generate data function

    process columns will also validate all the attrs like interval, increment, datatype, allownulls, behavior, min/max
    using increment will be used to set min and max and get next random data initially
    then in the generate data function, using the interval and increment to set the new min and/or max

    this can also test the generate random data function which will receive a data generator object with max / min and data type values
*/


var chai = require('chai');
var expect = chai.expect;

chai.use(require('chai-things'));
var _ = require('lodash');
var logger   = require('../utils/logger').logger;

var processColumns = require('../utils/processColumns');


describe('function processColumns tests', function(){

    it('processColumns clips the ', function() {
      var columns = [
        {
          "dataType": "text",
          "maxValue": "5",
          "interval": "1",
          "hierarchy": "none",
          "child": {}
        },{
          "dataType": "integer",
          "maxValue": "100",
          "interval": "1",
          "hierarchy": "none",
          "child": {}
        },{
          "dataType": "date",
          "maxValue": "2010-03-05",
          "interval": "1",
          "hierarchy": "none",
          "child": {}
        }
      ];
      var numberOfRecords = 5;
      columns = processColumns(columns, numberOfRecords)
      for(var i = 0; i < columns.length; i++) {
        expect(columns[i]).to.have.property('intervalCounter');
      }
    })

});
