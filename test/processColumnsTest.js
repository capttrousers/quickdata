/*
    this files is to test the process columns function

    this function will take an array of column objects and turn it into an array of data generator objects to use in generate data function

    process columns will also validate all the attrs like count, datatype, allowNulls, behavior, min/max
    using count will be used to set min and max and get next random data initially
    then in the generate data function, using the count  to set the new min and/or max

    this can also test the generate random data function which will receive a data generator object with max / min and data type values
*/


var chai = require('chai');
var expect = chai.expect;
var _ = require('lodash');
var logger   = require('../utils/logger').logger;

var processColumns = require('../utils/processColumns');

var bodyDateHierarchy = require('../data/bodyTesterDateHierarchy');
var bodyFileList = require('../data/bodyTesterFileList');
var bodyFileListSingleColumn = require('../data/bodyTesterFileListSingleColumn');
var bodyDateHierarchyNulls = require('../data/bodyTesterDateHierarchyNulls');
var bodyAllTypes = require('../data/bodyTesterNoFiles');
var bodyTrend = require('../data/bodyTesterPositiveTrend');

describe('method : processColumns tests', function(){
    before(function() {
      this.columns = [
        {
          "dataType": "text",
          "maxValue": "5",
          "minValue": "0",
          "count": "1",
          "behavior" : "random",
          "hierarchy": "parent",
          "child": {
            "dataType": "text",
            "maxValue": "5",
            "minValue": "0",
            "count": "10",
            "behavior" : "random",
            "hierarchy": "child",
            "child": {}
          }
        },{
          "dataType": "integer",
          "maxValue": "100",
          "minValue": "-100",
          "count": "500",
          "behavior" : "random",
          "hierarchy": "none",
          "child": {}
        },{
          "dataType": "date",
          "maxValue": "2018-03-05",
          "minValue": "2010-03-05",
          "count": "10000",
          "behavior" : "random",
          "hierarchy": "none",
          "child": {}
        }
      ];
      this.numberOfRecords = 50;
    })

    describe("Tests data type file with data list", function() {

      it("Processes body w/ file list of 2 columns and returns array of length 2", function() {
        expect(processColumns(bodyFileList.columns, bodyFileList.numberOfRecords)).to.have.lengthOf(2);
      })

      it("Processes body w/ file list of 1 column and returns array of length 1", function() {
        expect(processColumns(bodyFileListSingleColumn.columns, bodyFileListSingleColumn.numberOfRecords)).to.have.lengthOf(1);
      })

      it("Processes body w/ file list of 1 column which has prop nextIndex", function() {
        expect(processColumns(bodyFileListSingleColumn.columns, bodyFileListSingleColumn.numberOfRecords)[0]).to.have.property("nextIndex");
      })

      it("Processes body w/ file list of 1 column which has prop fieldName", function() {
        var column = processColumns(bodyFileListSingleColumn.columns, bodyFileListSingleColumn.numberOfRecords)[0];
        expect(column).to.have.property("fieldName").that.equals(bodyFileListSingleColumn.columns[0].file.fields[0]);
      })

      it("Processes body w/ file list of 2 columns and returns array of columns w/ fieldName props", function() {
        var columns = processColumns(bodyFileList.columns, bodyFileList.numberOfRecords);
        columns.forEach((column) => {
          expect(column).to.have.property("fieldName");
        })
      })

      it("Processes body w/ file list of 2 columns and returns array of columns w/ nextIndex props", function() {
        var columns = processColumns(bodyFileList.columns, bodyFileList.numberOfRecords);
        columns.forEach((column) => {
          expect(column).to.have.property("nextIndex");
        })
      })

      it("Processes body w/ file list of 2 columns has parent with fieldName Subcategory", function() {
        var columns = processColumns(bodyFileList.columns, bodyFileList.numberOfRecords);
        columns.forEach((column) => {
          if(column.hierarchy == "parent") {
            expect(column.fieldName).to.equal("Subcategory");
          }
        })
      })

      it("Processes body w/ file list of 2 columns has count of 1", function() {
        var columns = processColumns(bodyFileList.columns, bodyFileList.numberOfRecords);
        columns.forEach((column) => {
          expect(column.count).to.equal(1);
        })
      })

      it("Processes body w/ file list of 2 columns parent w/ prop childIndex, child w/ prop parentIndex", function() {
        var columns = processColumns(bodyFileList.columns, bodyFileList.numberOfRecords);
        columns.forEach((column) => {
          if(column.hierarchy == "parent") {
            expect(column).to.have.property("childIndex");
          }
          if(column.hierarchy == "child") {
            expect(column).to.have.property("parentIndex");
          }
        })
      })

    });

    describe("test on raw column object", function() {

      it('processColumns creates a column object with all the props', function() {
          var columnObjects =  [
            {
              "dataType": "date",
              "maxValue": "2018-03-05",
              "minValue": "2010-03-05",
              "count": "10000",
              "behavior" : "random",
              "hierarchy": "none",
              "child": {}
            }
          ]
          var column = processColumns(columnObjects, 50)[0];
          expect(column).to.have.property('intervalCounter');
          expect(column).to.have.property('fieldName');
          expect(column).to.have.property('hierarchy');
          expect(column).to.have.property('count');
          expect(column).to.have.property('minValue');
          expect(column).to.have.property('maxValue');
      })

    })

    describe("tests on body objects from data files", function () {

      it('processColumns clips the count to the number of records', function() {
        _.forEach(processColumns(bodyDateHierarchy.columns, bodyDateHierarchy.numberOfRecords), function(column) {
            expect(column).to.have.property('intervalCounter').that.is.at.most(column.numberOfRecords);
            expect(column).to.have.property('count').that.is.at.most(column.numberOfRecords);
        });
      });

      it('processColumns returns columns with allow nulls', function() {
        _.forEach(processColumns(bodyDateHierarchyNulls.columns, bodyDateHierarchyNulls.numberOfRecords), function(column) {
            expect(column).to.have.property('allowNulls').that.is.true;
        });
      });

    })

    describe("Processing parent/child columns", function() {
      it('Type: date, parent/child returns array of length 2', function() {
        expect(processColumns(bodyDateHierarchy.columns, bodyDateHierarchy.numberOfRecords)).to.have.lengthOf(2);
      });

      it('Type: date, parent/child returns parent date < child date', function() {
        var columns = processColumns(bodyDateHierarchy.columns, bodyDateHierarchy.numberOfRecords);
        expect(new Date(columns[0].nextRandomData)).to.be.below(new Date(columns[1].nextRandomData));
      });

      it('Type: date, parent/child clips child date to be <= parent date', function() {
        var clone = _.clone(bodyDateHierarchy);
        clone.columns[0].child.maxValue = "2020-01-01";
        var columns = processColumns(clone.columns, clone.numberOfRecords);
        expect(new Date(columns[0].nextRandomData)).to.be.at.most(new Date(columns[1].nextRandomData));
      });

    })

    describe("Processing on this.columns", function () {

      it('processColumns clips the count to the number of records', function() {
        _.forEach(processColumns(this.columns, this.numberOfRecords), function(column) {
            expect(column).to.have.property('intervalCounter').that.is.at.most(column.numberOfRecords);
            expect(column).to.have.property('count').that.is.at.most(column.numberOfRecords);
        });
      })

      it('Returns columns array where each has a name prop', function() {
        _.forEach(processColumns(this.columns, this.numberOfRecords), function(column) {
            expect(column).to.have.property('fieldName');
        });
      })

      it('Returns columns array where each has a hierarchy prop', function() {
        _.forEach(processColumns(this.columns, this.numberOfRecords), function(column) {
            expect(column).to.have.property('hierarchy');
        });
      })

      it('Returns columns array where each has a count prop', function() {
        _.forEach(processColumns(this.columns, this.numberOfRecords), function(column) {
            expect(column).to.have.property('count');
        });
      })

      it('Returns columns array where each has a max value prop', function() {
        _.forEach(processColumns(this.columns, this.numberOfRecords), function(column) {
            expect(column).to.have.property('maxValue');
        });
      })

      it('Returns columns array where each has a min value prop', function() {
        _.forEach(processColumns(this.columns, this.numberOfRecords), function(column) {
            expect(column).to.have.property('minValue');
        });
      })

      it('Takes columns[3] & parent child hierarchy, returns columns[4]', function() {
        expect(processColumns(this.columns, this.numberOfRecords)).to.have.lengthOf(4);
      })

    })

    describe("processColumns and trending columns, dates/ints/decimals", function() {

      it('decimal:positive:count=5:max=45:#Records=10 will limit count', function() {
        var columns = [
        {
          "dataType": "decimal",
          "maxValue": "45",
          "minValue": "1",
          "count": "10",
          "behavior" : "positive",
          "hierarchy": "none",
          "child": {}
        }]
        columns = processColumns(columns, "10");
        expect(columns).to.have.lengthOf(1);
        expect(columns[0]).to.have.property("count");
        expect(columns[0].count).to.be.a("number").and.to.equal(Math.floor(44 / 10));
      });


      it('integer:positive:count=1:max=1000:#Records=100 sets nextRandomData', function() {
        var columns = [
        {
          "dataType": "integer",
          "maxValue": "1000",
          "minValue": "0",
          "count": "1",
          "behavior" : "positive",
          "hierarchy": "none",
          "child": {}
        }]
        columns = processColumns(columns, "100");
        expect(columns).to.have.lengthOf(1);
        expect(columns[0]).to.have.property("count");
        expect(columns[0].count).to.be.a("number").and.to.equal(1);
        expect(columns[0]).to.have.property("nextRandomData");
        expect(columns[0].nextRandomData).to.be.a("number").and.to.equal(0);
      });

      it('bodyTrend test: resets count to 1', function() {

        var columns = processColumns(bodyTrend.columns, bodyTrend.numberOfRecords);
        expect(columns).to.have.lengthOf(3);
        expect(columns[2].count).to.be.a("number").and.to.equal(1);
      });

      it("positive trending Date, count 1, with nextRandomData of minValue", function() {
        var columns = [
        {
          "dataType": "date",
          "maxValue": "2017-03-18",
          "minValue": "1988-03-18",
          "count": "1",
          "behavior" : "positive",
          "hierarchy": "none",
          "child": {}
        }]
        columns = processColumns(columns, "10");
        expect(columns[0]).to.have.property("nextRandomData");
        expect(columns[0].minValue).to.be.a("date");
        expect(columns[0].maxValue).to.be.a("date");
        expect(new Date(+columns[0].maxValue + +columns[0].minValue)).to.be.a("date");
        expect(columns[0].maxValue - columns[0].minValue).to.be.a("number");
        expect(columns[0].maxValue + columns[0].minValue).to.be.a("string");
        expect(Math.floor((columns[0].maxValue - columns[0].minValue) / 365 / 24 / 60 / 60 / 1000)).to.equal(29);
        expect(columns[0].count).to.be.a("number");
        expect(columns[0].nextRandomData).to.be.a("string").and.to.equal(columns[0].minValue.toISOString());
      });

      it("positive trending Date, count of -1, will reset count", function() {
        var columns = [
        {
          "dataType": "date",
          "maxValue": "2017-03-18",
          "minValue": "1988-03-18",
          "count": "-1",
          "behavior" : "positive",
          "hierarchy": "none",
          "child": {}
        }]
        columns = processColumns(columns, "10");
        expect(columns[0].count).to.be.a("number").and.to.be.above(0);
      });

      it("negative trending Date, decrement 1, with nextRandomData of maxValue", function() {});

    });



});
