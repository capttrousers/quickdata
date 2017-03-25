/*
    this files is to test the process columns function

    this function will take an array of column objects and turn it into an array of data generator objects to use in generate data function

    process columns will also validate all the attrs like interval, increment, datatype, allowNulls, behavior, min/max
    using increment will be used to set min and max and get next random data initially
    then in the generate data function, using the interval and increment to set the new min and/or max

    this can also test the generate random data function which will receive a data generator object with max / min and data type values
*/


var chai = require('chai');
var expect = chai.expect;
var _ = require('lodash');
var logger   = require('../utils/logger').logger;

var processColumns = require('../utils/processColumns');


describe('method : processColumns tests', function(){
    before(function() {
      this.columns = [
        {
          "dataType": "text",
          "maxValue": "5",
          "minValue": "0",
          "interval": "10",
          "increment": "1",
          "hierarchy": "parent",
          "child": {
            "dataType": "text",
            "maxValue": "5",
            "minValue": "0",
            "interval": "10",
            "increment": "1",
            "hierarchy": "child",
            "child": {}
          }
        },{
          "dataType": "integer",
          "maxValue": "100",
          "minValue": "-100",
          "interval": "500",
          "increment": "1",
          "hierarchy": "none",
          "child": {}
        },{
          "dataType": "date",
          "maxValue": "2018-03-05",
          "minValue": "2010-03-05",
          "interval": "10000",
          "increment": "1",
          "hierarchy": "none",
          "child": {}
        }
      ];
      this.numberOfRecords = 50;
    })

    it('processColumns creates a column object with all the props', function() {
        var columnObjects =  [
          {
            "dataType": "date",
            "maxValue": "2018-03-05",
            "minValue": "2010-03-05",
            "interval": "10000",
            "increment": "1",
            "hierarchy": "none",
            "child": {}
          }
        ]
        var column = processColumns(columnObjects, 50)[0];
        expect(column).to.have.property('intervalCounter');
        expect(column).to.have.property('interval');
        expect(column).to.have.property('name');
        expect(column).to.have.property('hierarchy');
        expect(column).to.have.property('increment');
        expect(column).to.have.property('minValue');
        expect(column).to.have.property('maxValue');
    })

    it('processColumns clips the interval to the number of records', function() {
      _.forEach(processColumns(this.columns, this.numberOfRecords), function(column) {
          expect(column).to.have.property('intervalCounter').that.is.at.most(column.numberOfRecords);
          expect(column).to.have.property('interval').that.is.at.most(column.numberOfRecords);
      });
    })

    it('processColumns returns columns array where each has a name attribute', function() {
      _.forEach(processColumns(this.columns, this.numberOfRecords), function(column) {
          expect(column).to.have.property('name');
      });
    })

    it('processColumns returns columns array where each has a hierarchy attribute', function() {
      _.forEach(processColumns(this.columns, this.numberOfRecords), function(column) {
          expect(column).to.have.property('hierarchy');
      });
    })

    it('processColumns returns columns array where each has a increment attribute', function() {
      _.forEach(processColumns(this.columns, this.numberOfRecords), function(column) {
          expect(column).to.have.property('increment');
      });
    })

    it('processColumns returns columns array where each has a max value attribute', function() {
      _.forEach(processColumns(this.columns, this.numberOfRecords), function(column) {
          expect(column).to.have.property('maxValue');
      });
    })

    it('processColumns returns columns array where each has a min value attribute', function() {
      _.forEach(processColumns(this.columns, this.numberOfRecords), function(column) {
          expect(column).to.have.property('minValue');
      });
    })

    it('processColumns accepts columns[3] with a parent child hierarchy and returns columns[4]', function() {
      expect(processColumns(this.columns, this.numberOfRecords)).to.have.lengthOf(4);
    })
});
