var expect = require('chai').expect;

var logger   = require('../server/utils/logger').logger;

var _ = require("lodash");

var isValidBody = require('../server/utils/isValidBody');

var dataColumnObject = require('../data/dataColumnObject');
var bodyTemplate = require('../data/bodyTemplate');
var bodyTrend = require('../data/bodyTesterPositiveTrend');

describe("method: isValidBody tests", function() {

  describe("tests body column objects in ./data", function(){

    it("returns true with bodyTemplate.js file", function() {
      expect(isValidBody(bodyTemplate)).to.be.a("string").and.to.equal("");;
    });

    it("Invalid w/ dataColumnObject.js file at min and max with empty strings", function() {
      var body = bodyTemplate;
      body.columns.push(dataColumnObject);
      expect(isValidBody(body)).to.be.a("string").and.to.equal("invalid column properties");

    });

    it("returns false with decimal and increment below 1", function () {
      var body = _.clone(bodyTemplate);
      body.columns = [];
      var decimalColumn = _.clone(dataColumnObject);
      decimalColumn.dataType = "decimal";
      decimalColumn.count = ".3";
      decimalColumn.minValue = "0";
      decimalColumn.maxValue = "3000";
      decimalColumn.behavior = "positive";
      body.columns.push(decimalColumn);
      expect(isValidBody(body)).to.be.a("string").and.to.equal("");;
    });

    it("returns false with int and max as nulls", function () {
      var body = _.clone(bodyTemplate);
      body.columns = [];
      var intColumn = _.clone(dataColumnObject);
      intColumn.dataType = "integer";
      intColumn.minValue = "0";
      intColumn.maxValue = null;
      body.columns.push(intColumn);
      expect(isValidBody(body)).to.be.a("string").and.to.equal("invalid column properties");
    });

    it("returns false with int and min as nulls", function () {
      var body = _.clone(bodyTemplate);
      body.columns = [];
      var intColumn = _.clone(dataColumnObject);
      intColumn.dataType = "integer";
      intColumn.minValue = null;
      intColumn.maxValue = "100";
      body.columns.push(intColumn);
      expect(isValidBody(body)).to.be.a("string").and.to.equal("invalid column properties");
    });

    it("returns false with int and max as undefined", function () {
      var body = _.clone(bodyTemplate);
      body.columns = [];
      var intColumn = _.clone(dataColumnObject);
      intColumn.dataType = "integer";
      intColumn.minValue = "0";
      intColumn.maxValue = undefined;
      body.columns.push(intColumn);
      expect(isValidBody(body)).to.be.a("string").and.to.equal("invalid column properties");
    });

    it("returns false with int and min as undefined", function () {
      var body = _.clone(bodyTemplate);
      body.columns = [];
      var intColumn = _.clone(dataColumnObject);
      intColumn.dataType = "integer";
      intColumn.minValue = undefined;
      intColumn.maxValue = "155";
      body.columns.push(intColumn);
      expect(isValidBody(body)).to.be.a("string").and.to.equal("invalid column properties");
    });

    it("returns false with int and max as NaN", function () {
      var body = _.clone(bodyTemplate);
      body.columns = [];
      var intColumn = _.clone(dataColumnObject);
      intColumn.dataType = "integer";
      intColumn.minValue = "0";
      intColumn.maxValue = NaN;
      body.columns.push(intColumn);
      expect(isValidBody(body)).to.be.a("string").and.to.equal("invalid min or max values");
    });

    it("returns false with int and min as NaN", function () {
      var body = _.clone(bodyTemplate);
      body.columns = [];
      var intColumn = _.clone(dataColumnObject);
      intColumn.dataType = "integer";
      intColumn.minValue = NaN;
      intColumn.maxValue = "100";
      body.columns.push(intColumn);
      expect(isValidBody(body)).to.be.a("string").and.to.equal("invalid min or max values");
    });

    it("returns false with int and max as invalid string", function () {
      var body = _.clone(bodyTemplate);
      body.columns = [];
      var intColumn = _.clone(dataColumnObject);
      intColumn.dataType = "integer";
      intColumn.minValue = "0";
      intColumn.maxValue = "asdasd";
      body.columns.push(intColumn);
      expect(isValidBody(body)).to.be.a("string").and.to.equal("invalid min or max values");
    });

    it("returns false with int and min as invalid string", function () {
      var body = _.clone(bodyTemplate);
      body.columns = [];
      var intColumn = _.clone(dataColumnObject);
      intColumn.dataType = "integer";
      intColumn.minValue = "asdsadf";
      intColumn.maxValue = "100";
      body.columns.push(intColumn);
      expect(isValidBody(body)).to.be.a("string").and.to.equal("invalid min or max values");
    });

    it("Invalid with Date and max as null", function () {
      var body = _.clone(bodyTemplate);
      body.columns = [];
      var intColumn = _.clone(dataColumnObject);
      intColumn.dataType = "date";
      intColumn.minValue = "2017-01-01";
      intColumn.maxValue = null;
      body.columns.push(intColumn);
      expect(isValidBody(body)).to.be.a("string").and.to.equal("invalid column properties");
    });

    it("Invalid with Date and min as null", function () {
      var body = _.clone(bodyTemplate);
      body.columns = [];
      var intColumn = _.clone(dataColumnObject);
      intColumn.dataType = "date";
      intColumn.minValue = null;
      intColumn.maxValue = "2017-01-01";
      body.columns.push(intColumn);
      expect(isValidBody(body)).to.be.a("string").and.to.equal("invalid column properties");
    });

    it("Invalid with Date and max as undefined", function () {
      var body = _.clone(bodyTemplate);
      body.columns = [];
      var intColumn = _.clone(dataColumnObject);
      intColumn.dataType = "date";
      intColumn.minValue = "2017-01-01";
      intColumn.maxValue = undefined;
      body.columns.push(intColumn);
      expect(isValidBody(body)).to.be.a("string").and.to.equal("invalid column properties");
    });

    it("Invalid with Date and min as undefined", function () {
      var body = _.clone(bodyTemplate);
      body.columns = [];
      var intColumn = _.clone(dataColumnObject);
      intColumn.dataType = "date";
      intColumn.minValue = undefined;
      intColumn.maxValue = "2017-01-01";
      body.columns.push(intColumn);
      expect(isValidBody(body)).to.be.a("string").and.to.equal("invalid column properties");
    });

    it("Invalid with Date and max as NaN", function () {
      var body = _.clone(bodyTemplate);
      body.columns = [];
      var intColumn = _.clone(dataColumnObject);
      intColumn.dataType = "date";
      intColumn.minValue = "2017-01-01";
      intColumn.maxValue = NaN;
      body.columns.push(intColumn);
      expect(isValidBody(body)).to.be.a("string").and.to.equal("invalid date min or max values");
    });

    it("Invalid with Date and min as NaN", function () {
      var body = _.clone(bodyTemplate);
      body.columns = [];
      var intColumn = _.clone(dataColumnObject);
      intColumn.dataType = "date";
      intColumn.minValue = NaN;
      intColumn.maxValue = "2017-01-01";
      body.columns.push(intColumn);
      expect(isValidBody(body)).to.be.a("string").and.to.equal("invalid date min or max values");
    });

    it("Invalid with Date and max as invalid date string", function () {
      var body = _.clone(bodyTemplate);
      body.columns = [];
      var intColumn = _.clone(dataColumnObject);
      intColumn.dataType = "date";
      intColumn.minValue = "2017-01-01";
      intColumn.maxValue = "2001/09/09";
      body.columns.push(intColumn);
      expect(isValidBody(body)).to.be.a("string").and.to.equal("invalid date min or max values");
    });

    it("Invalid with Date and min as invalid date string", function () {
      var body = _.clone(bodyTemplate);
      body.columns = [];
      var intColumn = _.clone(dataColumnObject);
      intColumn.dataType = "date";
      intColumn.minValue = "2001/09/09";
      intColumn.maxValue = "2017-01-01";
      body.columns.push(intColumn);
      expect(isValidBody(body)).to.be.a("string").and.to.equal("invalid date min or max values");
    });

    it("Invalid with Date and max with text in the date string", function () {
      var body = _.clone(bodyTemplate);
      body.columns = [];
      var intColumn = _.clone(dataColumnObject);
      intColumn.dataType = "date";
      intColumn.minValue = "2017-01-01";
      intColumn.maxValue = "asdasd";
      body.columns.push(intColumn);
      expect(isValidBody(body)).to.be.a("string").and.to.equal("invalid date min or max values");
    });

    it("Invalid with Date and min with text in the date string", function () {
      var body = _.clone(bodyTemplate);
      body.columns = [];
      var intColumn = _.clone(dataColumnObject);
      intColumn.dataType = "date";
      intColumn.minValue = "sadaed";
      intColumn.maxValue = "2017-01-01";
      body.columns.push(intColumn);
      expect(isValidBody(body)).to.be.a("string").and.to.equal("invalid date min or max values");
    });

    it("Invalid with Date and max as empty string", function () {
      var body = _.clone(bodyTemplate);
      body.columns = [];
      var intColumn = _.clone(dataColumnObject);
      intColumn.dataType = "date";
      intColumn.minValue = "2017-01-01";
      intColumn.maxValue = "";
      body.columns.push(intColumn);
      expect(isValidBody(body)).to.be.a("string").and.to.equal("invalid column properties");
    });

    it("Invalid with Date and min empty string", function () {
      var body = _.clone(bodyTemplate);
      body.columns = [];
      var intColumn = _.clone(dataColumnObject);
      intColumn.dataType = "date";
      intColumn.minValue = "";
      intColumn.maxValue = "2017-01-01";
      body.columns.push(intColumn);
      expect(isValidBody(body)).to.be.a("string").and.to.equal("invalid column properties");
    });

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
      expect(parseInt("1000", 10)).to.be.a("number").and.to.equal(1000);
    });

    it("parses a float from a string", function() {
      expect(parseFloat("100.0123", 10)).to.be.a("number").and.to.equal(100.0123);
    });


  })
});
