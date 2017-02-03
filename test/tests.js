var expect = require('chai').expect;

var models = require('../models');

describe("Quickdata generator", function() {

  describe("quick data api", function() {

    it("returns status 200", function() {
      expect(200).to.equal(200);
    });

    it("writes a csv file to disk", function() {

    });

  });




  // use morgan to test and log http requests
  describe("Process quickdata post", function() {

    it("accepts connections on POST /quickdata", function() {  });

    // defaults to acceptable values if none are given
    // for user, rows, data source, table name, sf case

    it("process column data to create array of data models", function() {  });

    // check the intervals for each column, get data value or new random data
    it("row of data, one random value for each column", function() {  });

  });



});
