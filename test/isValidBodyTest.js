var expect = require('chai').expect;

var logger   = require('../utils/logger').logger;

var isValidBody = require('../utils/isValidBody');

var dataColumnObject = require('../data/dataColumnObject');
var bodyTemplate = require('../data/bodyTemplate');
var bodyTrend = require('../data/bodyTesterPositiveTrend');

describe("method: isValidBody tests", function() {

  describe("tests body column objects in ./data", function(){

    it("returns true with bodyTemplate.js file", function() {
      expect(isValidBody(bodyTemplate)).to.be.true;
    });

    it("returns false with dataColumnObject.js file at min and max", function() {
      var body = bodyTemplate;
      body.columns.push(dataColumnObject);
      expect(isValidBody(body)).to.be.false;

    });

    it("returns false with dataColumnObject.js file at min and max", function() {
      var body = bodyTemplate;
      body.columns.push(dataColumnObject);
      expect(isValidBody(body)).to.be.false;

    });

    it("returns false with trend column with invalid min/max range/increment", function() {
      bodyTrend.numberOfRecords = 500;
      expect(isValidBody(bodyTrend)).to.be.false;
    })

  });

  describe("tests math on strings", function() {

    it("subtracts two strings of ints", function() {
      expect("1000" - "-10").to.be.a("number").and.to.equal(1010);
    });

    it("divides two strings of ints", function() {
      expect("1000" / "500").to.be.a("number").and.to.equal(2);
    });

    it("multiplies two strings of ints", function() {
      expect("1000" * "500").to.be.a("number").and.to.equal(500000);
    });

    it("adds two strings of ints", function() {
      expect("1000" + "500").to.be.a("string").and.to.equal("1000500");
    });

  })

  describe("tests parseInt and parseFloat", function() {

    it("parses an int from a string", function() {
      expect(Number.parseInt("1000", 10)).to.be.a("number").and.to.equal(1000);
    });

    it("parses a float from a string", function() {
      expect(Number.parseFloat("100.0123", 10)).to.be.a("number").and.to.equal(100.0123);
    });


  })
});
