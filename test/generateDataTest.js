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

var bodyDateHierarchy = require('../data/bodyTesterDateHierarchy');
var bodyNulls = require('../data/bodyTesterNulls');
var bodyDateNulls = require('../data/bodyTesterDateNulls');
var bodyTrend = require('../data/bodyTesterPositiveTrend');

describe.only('method : generateData tests', function(){

    it('generateDate for each row has parent date < child date', function() {
      var columns = processColumns(bodyDateHierarchy.columns, +bodyDateHierarchy.numberOfRecords);
      var data = generateData(columns, +bodyDateHierarchy.numberOfRecords);
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

    it("generates data for 4 primitive types with nulls @ ~10%", function() {
      var total = 0;
      var data = generateData(processColumns(bodyNulls.columns, +bodyNulls.numberOfRecords), +bodyNulls.numberOfRecords);
      bodyNulls.columns.forEach(function(column) {
          data.forEach( function (row) {
            if(row[column.name] == null) {
              total++;
            }
          });
          expect(total / +bodyNulls.numberOfRecords).to.be.above(.06).and.below(.14);
          total = 0;
      });
    })

    it("generates data for decimal type with nulls @ ~10%", function() {
      var total = 0;
      var data = generateData(processColumns(bodyNulls.columns, +bodyNulls.numberOfRecords), +bodyNulls.numberOfRecords);
      data.forEach( function (row) {
        if(row["Decimal column 1"] == null) {
          total++;
        }
      });
      expect(total / +bodyNulls.numberOfRecords).to.be.above(.06).and.below(.14);
    })

    it("generates data for date type with nulls @ ~10%", function() {
      var total = 0;
      var data = generateData(processColumns(bodyNulls.columns, +bodyNulls.numberOfRecords), +bodyNulls.numberOfRecords);
      data.forEach( function (row) {
        if(row["Date column 1"] == null) {
          total++;
        }
      });
      expect(total / +bodyNulls.numberOfRecords).to.be.above(.06).and.below(.14);
    })

    it("generates data for integer type with nulls @ ~10%", function() {
      var total = 0;
      var data = generateData(processColumns(bodyNulls.columns, +bodyNulls.numberOfRecords), +bodyNulls.numberOfRecords);
      data.forEach( function (row) {
        if(row["Integer column 1"] == null) {
          total++;
        }
      });
      expect(total / +bodyNulls.numberOfRecords).to.be.above(.06).and.below(.14);
    });

    it("generates data for text type with nulls @ ~10%", function() {
      var total = 0;
      var data = generateData(processColumns(bodyNulls.columns, +bodyNulls.numberOfRecords), +bodyNulls.numberOfRecords);
      data.forEach( function (row) {
        if(row["Text column 1"] == null) {
          total++;
        }
      });
      expect(total / +bodyNulls.numberOfRecords).to.be.above(.06).and.below(.14);
    });

    it("generates data for integer type with positive trend", function() {
      var data = generateData(processColumns(bodyTrend.columns, +bodyTrend.numberOfRecords), +bodyTrend.numberOfRecords);
      for(var i = 0; i < bodyTrend.numberOfRecords - 1; i++) {
        expect(data[i]["Integer column 1"]).to.be.below(data[i + 1]["Integer column 1"]).and.be.a('number');
      }
    });
    
    
    // from bodyTesterPositiveTrend, integer has positive trend, decimal has postive trend with max value < numberOfRecords
    it.only("WHAT HAPPENS: generates data for decimal type with positive trend with greater number of records than max value", function() {
      var data = generateData(processColumns(bodyTrend.columns, bodyTrend.numberOfRecords), bodyTrend.numberOfRecords);
      for(var i = 0; i < bodyTrend.numberOfRecords - 1; i++) {
        expect(data[i]["Decimal column 1"]).to.be.below(data[i + 1]["Decimal column 1"]).and.be.at.most(bodyTrend.columns[2].maxValue + 100).and.be.a('number');
      }
    });
    
    it('date plus 1 is day or second or millisecond level?', function() {
        var date = new Date();
        expect(new Date(date).setDate(date.getDate() + 1)).to.be.above(date).and.to.be.a('number');
    });

});
