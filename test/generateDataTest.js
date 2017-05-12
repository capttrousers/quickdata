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
var bodyDateHierarchyNulls = require('../data/bodyTesterDateHierarchyNulls');
var bodyTrend = require('../data/bodyTesterPositiveTrend');
var bodyFileList = require('../data/bodyTesterFileList');
var bodyFileListSingleColumn = require('../data/bodyTesterFileListSingleColumn');

describe('method : generateData tests', function(){


  describe("Tests file list data generation", function() {

    it("generates data values from file list with single column", function(done) {

      var columns = processColumns(bodyFileListSingleColumn.columns, bodyFileListSingleColumn.numberOfRecords);
      var data = generateData(columns, bodyFileListSingleColumn.numberOfRecords);

      var possibilities = [];
      columns[0].file.values.forEach( (obj) => {
        possibilities.push(obj[columns[0].fieldName]);
      });
      _.forEach(data, function(row) {
        expect(row[columns[0].fieldName]).to.be.oneOf(possibilities);
      })
      done();
    })

    it("finds index of a specific value in the file.values list", function() {
      var parentFieldName = "Subcategory";
      var childFieldName = "Category";
      var row = {
         "Category": "Category 1",
         "Subcategory": "Sub-category 3"
        }
      var index = _.findIndex( bodyFileList.columns[0].file.values, (valueRow) => { return valueRow[parentFieldName] == row[parentFieldName]; } );
      expect(index).to.equal(2);
    })

    it("generates data values from file list with two columns", function(done) {
      var columns = processColumns(bodyFileList.columns, bodyFileList.numberOfRecords);
      var data = generateData(columns, bodyFileList.numberOfRecords);
      data.forEach(function(row) {
        var index = _.findIndex( columns[0].file.values, (valueRow) => { return valueRow["Subcategory"] == row["Subcategory"] } );
        expect(index).to.be.a("number");
        expect(index).to.be.below(columns[0].file.values.length).and.at.least(0);
        expect(row["Category"]).to.equal(columns[0].file.values[index]["Category"]);
      });
      done();
    })

  })

  describe("Tests parent/child hierarchy for text and date datatypes", function() {

    it('generateDate for each row has parent date < child date', function(done) {
      var columns = processColumns(bodyDateHierarchy.columns, bodyDateHierarchy.numberOfRecords);
      var data = generateData(columns, bodyDateHierarchy.numberOfRecords);
      _.forEach(data, function(row) {
        expect(new Date(row["Date column 1"])).to.be.below(new Date(row["Date column 2"]));
      });
      expect(data).to.have.lengthOf(500);
      done();
    })

  })

  describe("Checks allowNulls at 10%", function() {
    it("Type: date, generates nulls @ ~10% for parent and child in hierarchy", function(done) {
      var totalParent = totalChild = 0;
      var data = generateData(processColumns(bodyDateHierarchyNulls.columns, bodyDateHierarchyNulls.numberOfRecords), bodyDateHierarchyNulls.numberOfRecords);
      data.forEach( function (row) {
        if(row["Date column 1"] == null) {
          totalParent++;
        }
        if(row["Date column 2"] == null) {
          totalChild++;
        }

      });
      expect(data).to.have.lengthOf(1000);
      expect(data[0]).to.have.property("Date column 1");
      expect(data[0]).to.have.property("Date column 2");
      // expect(totalParent / bodyDateHierarchyNulls.numberOfRecords).to.be.above(.06).and.below(.14);
      // expect(totalChild / bodyDateHierarchyNulls.numberOfRecords).to.be.above(.06).and.below(.14);
      done();
    });


    it('generates 1000 random values, returns % >= .8 (should be 20%)', function(done) {
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
      done();
    })

    it("generates data for 4 primitive types with nulls @ ~10%", function(done) {
      var total = 0;
      var data = generateData(processColumns(bodyNulls.columns, bodyNulls.numberOfRecords), bodyNulls.numberOfRecords);
      bodyNulls.columns.forEach(function(column) {
          data.forEach( function (row) {
            if(row[column.fieldName] == null) {
              total++;
            }
          });
          expect(total / bodyNulls.numberOfRecords).to.be.above(.06).and.below(.14);
          total = 0;
      });
      done();
    })

    it("generates data for decimal type with nulls @ ~10%", function(done) {
      var total = 0;
      var data = generateData(processColumns(bodyNulls.columns, bodyNulls.numberOfRecords), bodyNulls.numberOfRecords);
      data.forEach( function (row) {
        if(row["Decimal column 1"] == null) {
          total++;
        }
      });
      expect(total / bodyNulls.numberOfRecords).to.be.above(.06).and.below(.14);
      done();
    })

    it("generates data for date type with nulls @ ~10%", function(done) {
      var total = 0;
      var data = generateData(processColumns(bodyNulls.columns, bodyNulls.numberOfRecords), bodyNulls.numberOfRecords);
      data.forEach( function (row) {
        if(row["Date column 1"] == null) {
          total++;
        }
      });
      expect(total / bodyNulls.numberOfRecords).to.be.above(.06).and.below(.14);
      done();
    })

    it("generates data for integer type with nulls @ ~10%", function(done) {
      var total = 0;
      var data = generateData(processColumns(bodyNulls.columns, bodyNulls.numberOfRecords), bodyNulls.numberOfRecords);
      data.forEach( function (row) {
        if(row["Integer column 1"] == null) {
          total++;
        }
      });
      expect(total / bodyNulls.numberOfRecords).to.be.above(.06).and.below(.14);
      done();
    });

    it("generates data for text type with nulls @ ~10%", function(done) {
      var total = 0;
      var data = generateData(processColumns(bodyNulls.columns, bodyNulls.numberOfRecords), bodyNulls.numberOfRecords);
      data.forEach( function (row) {
        if(row["Text column 1"] == null) {
          total++;
        }
      });
      expect(total / bodyNulls.numberOfRecords).to.be.above(.06).and.below(.14);
      done();
    });

  });

  describe("Checks trends for various dataTypes", function () {

      it("generates data for integer type with positive trend", function(done) {
        var columns = processColumns(JSON.parse(JSON.stringify(bodyTrend.columns)), bodyTrend.numberOfRecords);
        var data = generateData(columns, bodyTrend.numberOfRecords);
        for(var i = 1; i < bodyTrend.numberOfRecords; i++) {
          expect(data[i - 1]["Integer column 1"]).to.be.below(data[i]["Integer column 1"]).and.be.a('number');
        }
        done();
      });


      // from bodyTesterPositiveTrend, integer has positive trend, decimal has postive trend with max value < numberOfRecords
      it("generates data for decimal type with positive trend with greater number of records than max value", function(done) {
        var columns = processColumns(JSON.parse(JSON.stringify(bodyTrend.columns)), bodyTrend.numberOfRecords);
        var data = generateData(columns, bodyTrend.numberOfRecords);
        for(var i = 0; i < bodyTrend.numberOfRecords; i++) {
          expect(data[i]["Decimal column 1"]).to.be.and.be.a('number').at.most(bodyTrend.numberOfRecords);
        }
        done();
      });

      // from bodyTesterPositiveTrend, integer has positive trend, decimal has postive trend with max value < numberOfRecords
      it("generates data for decimal type with positive trend ", function(done) {
        var data = generateData(processColumns(bodyTrend.columns, bodyTrend.numberOfRecords), bodyTrend.numberOfRecords);
        for(var i = 1; i < bodyTrend.numberOfRecords; i++) {
          expect(data[i - 1]["Decimal column 1"]).to.be.at.most(data[i]["Decimal column 1"]);
        }
        done();
      });

      it('date plus 1 is day or second or millisecond level?', function() {
          var date = new Date();
          expect(new Date(date).setDate(date.getDate() + 1)).to.be.above(date).and.to.be.a('number');
      });


      it("positive trending Date, increment 1", function() {


      });

      it("positive trending Date, increment 6", function() {});

      it("negative trending Date, decrement 1", function() {});

      it("negative trending Date, decrement 800", function() {});

    })

});
