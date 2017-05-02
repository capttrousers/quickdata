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

var bodyDateHierarchy = require('../data/bodyTesterDateHierarchy');
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
          "interval": "100",
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
      this.numberOfRecords = "50";
    })

    describe("test on raw column object", function() {

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

    })

    describe("tests on body objects from data files", function () {

      it('processColumns clips the interval to the number of records', function() {
        _.forEach(processColumns(bodyDateHierarchy.columns, bodyDateHierarchy.numberOfRecords), function(column) {
            expect(column).to.have.property('intervalCounter').that.is.at.most(column.numberOfRecords);
            expect(column).to.have.property('interval').that.is.at.most(column.numberOfRecords);
        });
      });

      it('processColumns returns columns with allow nulls', function() {
        _.forEach(processColumns(bodyDateHierarchyNulls.columns, bodyDateHierarchyNulls.numberOfRecords), function(column) {
            expect(column).to.have.property('allowNulls').that.is.true;
        });
      });

    })

    describe("parent child tests", function() {
      it('processColumns with parent/child Date returns array of length 2', function() {
        expect(processColumns(bodyDateHierarchy.columns, bodyDateHierarchy.numberOfRecords)).to.have.lengthOf(2);
      });

      it('processColumns with parent/child Date has parent date < child date', function() {
        var columns = processColumns(bodyDateHierarchy.columns, bodyDateHierarchy.numberOfRecords);
        expect(new Date(columns[0].nextRandomData)).to.be.below(new Date(columns[1].nextRandomData));
      });

      it('processColumns with parent/child Date clips child date to be <= parent date', function() {
        var clone = _.clone(bodyDateHierarchy);
        clone.columns[0].child.maxValue = "2020-01-01";
        var columns = processColumns(clone.columns, clone.numberOfRecords);
        expect(new Date(columns[0].nextRandomData)).to.be.at.most(new Date(columns[1].nextRandomData));
      });

    })

    describe("tests on this.columns", function () {
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

    })

    describe("processColumns and trending columns, dates/ints/decimals", function() {

      it('decimal column : positive trend, increment 5, maxValue 45 and # of records 10 limits increment', function() {
        var columns = [
        {
          "dataType": "decimal",
          "maxValue": "45",
          "minValue": "1",
          "interval": "100",
          "trend": "positive",
          "increment": "5",
          "hierarchy": "none",
          "child": {}
        }]
        columns = processColumns(columns, "10");
        expect(columns).to.have.lengthOf(1);
        expect(columns[0]).to.have.property("interval");
        expect(columns[0].interval).to.be.a("number").and.to.equal(1);
        expect(columns[0]).to.have.property("increment");
        expect(columns[0].increment).to.be.a("number").and.to.equal(Math.floor(44 / 10));
      });


      it('integer column : positive trend, increment 1, maxValue 1000 and # of records 100 sets nextRandomData', function() {
        var columns = [
        {
          "dataType": "integer",
          "maxValue": "1000",
          "minValue": "0",
          "interval": "1",
          "trend": "positive",
          "increment": "1",
          "hierarchy": "none",
          "child": {}
        }]
        columns = processColumns(columns, "100");
        expect(columns).to.have.lengthOf(1);
        expect(columns[0]).to.have.property("interval");
        expect(columns[0].interval).to.be.a("number").and.to.equal(1);
        expect(columns[0]).to.have.property("increment");
        expect(columns[0].increment).to.be.a("number").and.to.equal(1);
        expect(columns[0]).to.have.property("nextRandomData");
        expect(columns[0].nextRandomData).to.be.a("number").and.to.equal(0);
      });

      it('trending body test: positive trend, increment 1, maxValue 100 and # of records 500 resets increment to 1', function() {

        var columns = processColumns(bodyTrend.columns, bodyTrend.numberOfRecords);
        expect(columns).to.have.lengthOf(3);
        expect(columns[2].increment).to.be.a("number").and.to.equal(1);
      });

      it("positive trending Date, increment 1, with nextRandomData of minValue", function() {
        var columns = [
        {
          "dataType": "date",
          "maxValue": "2017-03-18",
          "minValue": "1988-03-18",
          "interval": "1",
          "trend": "positive",
          "increment": "1",
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
        expect(columns[0].increment).to.be.a("number");
        expect(columns[0].nextRandomData).to.be.a("string");
      });

      it("negative trending Date, decrement 1, with nextRandomData of maxValue", function() {});

    });



});
