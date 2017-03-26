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

describe.only('method : generateData tests', function(){

    it('generateDate for each row has parent date < child date', function() {
      var columns = processColumns(body.columns, body.numberOfRecords);
      var data = generateData(columns, body.numberOfRecords);
      _.forEach(data, function(row) {
        expect(new Date(row["Date column 1"])).to.be.below(new Date(row["Date column 2"]));
      });
      expect(data).to.have.lengthOf(500);
    })
});
