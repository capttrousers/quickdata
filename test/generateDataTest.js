/*
    this files is to test the generate random data function

    generateData takes array of columnObjects and numberOfRecords
    returns array of rows, each row is object of col/record key/value pairs

*/


var chai = require('chai');
var expect = chai.expect;
var _ = require('lodash');
var logger   = require('../utils/logger').logger;

var processColumns = require('../utils/processColumns');
var generateData = require('../utils/generateData');

var body = require('../data/bodyTesterDateHierarchy');
var bodyNulls = require('../data/bodyTesterNulls');
var bodyDateNulls = require('../data/bodyTesterDateNulls');

describe.only('method : generateData tests', function(){

    it('generateDate for each row has parent date < child date', function() {
      var columns = processColumns(body.columns, body.numberOfRecords);
      var data = generateData(columns, body.numberOfRecords);
      _.forEach(data, function(row) {
        expect(new Date(row["Date column 1"])).to.be.below(new Date(row["Date column 2"]));
      });
      expect(data).to.have.lengthOf(500);
    })

    it('generates 1000 random values and returns % that were >= .8 (should be 20%)', function() {
      var TEST_NUMBER = 1000;
      var totalForAverage = 0;
      for(var j = 1; j <= TEST_NUMBER ; j++) {
        var count = 0;
        for(var i = 1; i <= TEST_NUMBER; i++) {
          if ( Math.random() >= .8 ) {
            count++;
          }
        }
        totalForAverage += (count / TEST_NUMBER)
      }
      expect(totalForAverage / TEST_NUMBER).to.be.above(.195).and.below(.205);
    })

    it("generates data for 4 primitive types with nulls @ 10%", function() {
      var total = 0;
      var data = generateData(processColumns(bodyNulls.columns, bodyNulls.numberOfRecords), bodyNulls.numberOfRecords);
      bodyNulls.columns.forEach(function(column) {
          data.forEach( function (row) {
            if(row[column.name] == null) {
              total++;
            }
          });
          expect(total / bodyNulls.numberOfRecords).to.be.above(.08).and.below(.12);
          total = 0;
      });
    })

    it("generates data for decimal type with nulls @ 10%", function() {
      var total = 0;
      var data = generateData(processColumns(bodyNulls.columns, bodyNulls.numberOfRecords), bodyNulls.numberOfRecords);
      data.forEach( function (row) {
        if(row["Decimal column 1"] == null) {
          total++;
        }
      });
      expect(total / bodyNulls.numberOfRecords).to.be.above(.08).and.below(.12);
    })

    it("generates data for date type with nulls @ 10%", function() {
      var total = 0;
      var data = generateData(processColumns(bodyNulls.columns, bodyNulls.numberOfRecords), bodyNulls.numberOfRecords);
      data.forEach( function (row) {
        if(row["Date column 1"] == null) {
          total++;
        }
      });
      expect(total / bodyNulls.numberOfRecords).to.be.above(.08).and.below(.12);
    })

    it("generates data for integer type with nulls @ 10%", function() {
      var total = 0;
      var data = generateData(processColumns(bodyNulls.columns, bodyNulls.numberOfRecords), bodyNulls.numberOfRecords);
      data.forEach( function (row) {
        if(row["Integer column 1"] == null) {
          total++;
        }
      });
      expect(total / bodyNulls.numberOfRecords).to.be.above(.08).and.below(.12);
    });

    it("generates data for text type with nulls @ 10%", function() {
      var total = 0;
      var data = generateData(processColumns(bodyNulls.columns, bodyNulls.numberOfRecords), bodyNulls.numberOfRecords);
      data.forEach( function (row) {
        if(row["Text column 1"] == null) {
          total++;
        }
      });
      expect(total / bodyNulls.numberOfRecords).to.be.above(.08).and.below(.12);
    });


});
