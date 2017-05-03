var expect = require('chai').expect;

var logger   = require('../utils/logger').logger;

var getRandomData = require('../utils/getRandomDataValue');
var addDays = require('date-fns/add_days');
var startOfDay = require('date-fns/start_of_day');
var isSameDay = require('date-fns/is_same_day');
var moment = require("moment");

describe("Random data generator", function() {
  before(function() {
    logger.info("Begin random data generator tests");
  })

  it("makes two startOfDay dates and compares with isSameDay date-fns", function() {
    var dateOne = startOfDay("2017-03-18");
    var dateTwo = startOfDay("2017-03-28");
    expect(isSameDay(addDays(dateOne, 10), dateTwo)).to.be.true;
  })

  it('adds a positive number of days with moment.js', function() {
    expect(moment("2017-03-18").add(10, "days").isSame(moment("2017-03-28"), "day")).to.be.true;
  })

  it('adds a negative number of days with moment.js', function() {
    expect(moment("2017-03-18").add(-10, "days").isSame(moment("2017-03-08"), "day")).to.be.true;
  })

  it("trending Date returns value incremented by 5 days", function() {
    var date = getRandomData({dataType: 'date', trend: "positive", increment: "5", nextRandomData: "2017-03-18"});
    expect(date).to.be.a('string').and.to.equal(moment("2017-03-23").toISOString());
  });

  it("trending Date returns value decremented by 5 days", function() {
    var date = getRandomData({dataType: 'date', trend: "negative", increment: "-5", nextRandomData: "2017-03-18"});
    expect(date).to.be.a('string').and.to.equal(moment("2017-03-13").toISOString());
  });

  it("trending integer returns value decremented by 5", function() {
    var date = getRandomData({dataType: 'integer', trend: "negative", increment: "-5", minValue: 0, maxValue: 1000});
    expect(date).to.be.a('number').and.to.equal(1000);
  });

  it("trending integer returns value incremented by 5", function() {
    var date = getRandomData({dataType: 'integer', trend: "positive", increment: "5", minValue: 0, maxValue: 1000});
    expect(date).to.be.a('number').and.to.equal(0);
  });

  it("returns value of type string", function() {
    var string = getRandomData({dataType: 'text', maxValue: 10});
    expect(string).to.be.a('string');
  });

  it("returns value of type integer", function() {
    var integer = getRandomData({dataType: 'integer', maxValue: 10});
    expect(integer).to.be.a('number');
  });

  it("returns value of type decimal", function() {
    var decimal = getRandomData({dataType: 'decimal', maxValue: 10});
    expect(decimal).to.be.a('number');
  });

  it("data type of Date returns value of type string", function() {
    var date = getRandomData({dataType: 'date', maxValue: 10, minValue: 0});
    expect(date).to.be.a('string');
  });

  it("generates a random integer value between min and max constraints", function() {
      // min is one so just check that values are between 1 and maxValue
      var integer = getRandomData({dataType: 'integer', maxValue: 10000, minValue: 0});
      expect(integer).to.be.below(10000);
  });

  it("generates a random decimal value between min and max constraints", function() {
      var decimal = getRandomData({dataType: 'decimal', maxValue: 10000, minValue: 0});
      expect(decimal).to.be.below(10000);
  });

  it("generates a random date value between min and max constraints", function() {
      // dates are strings of length: 24
      var dateString = getRandomData({dataType: 'date', maxValue: new Date(), minValue: '2000-01-01'});
      expect(dateString).to.have.lengthOf(24);
      // date max value is actually min date
      var date = getRandomData({dataType: 'date', minValue: "1988-03-18", maxValue: '2007-01-01'});
      expect(new Date(date)).to.be.at.least(new Date("1988-03-18"));
      expect(new Date(date)).to.be.at.most(new Date('2007-01-01'));
  });

  it("generates a random string value between min and max constraints", function() {
      var string1 = getRandomData({dataType: 'text', maxValue: 10});
      expect(string1).to.have.lengthOf(10);
      var string2 = getRandomData({dataType: 'text', maxValue: 100});
      expect(string2).to.have.lengthOf(100);
      var string3 = getRandomData({dataType: 'text', maxValue: 1000});
      expect(string3).to.have.lengthOf(1000);
  });

  it("returns null 10% of the time with column of type string with allowNulls=true", function(){
    var TEST_NUMBER = 1000;
    var totalForAverage = 0;
    for(var j = 1; j <= TEST_NUMBER ; j++) {
      if(getRandomData({dataType: "text", allowNulls: true}) == null) {
        totalForAverage++;
      }
    }
    expect(totalForAverage / TEST_NUMBER).to.be.above(.06).and.below(.14);
  })

  it("returns null 10% of the time with column of type date with allowNulls=true", function(){
    var TEST_NUMBER = 1000;
    var totalForAverage = 0;
    for(var j = 1; j <= TEST_NUMBER ; j++) {
      if(getRandomData({dataType: "date", allowNulls: true, minValue: "2000-01-01", maxValue: "2017-01-01"}) == null) {
        totalForAverage++;
      }
    }
    expect(totalForAverage / TEST_NUMBER).to.be.above(.06).and.below(.14);
  })

  it("returns null 10% of the time with column of type integer with allowNulls=true", function(){
    var TEST_NUMBER = 1000;
    var totalForAverage = 0;
    for(var j = 1; j <= TEST_NUMBER ; j++) {
      if(getRandomData({dataType: "integer", allowNulls: true}) == null) {
        totalForAverage++;
      }
    }
    expect(totalForAverage / TEST_NUMBER).to.be.above(.06).and.below(.14);
  })

  it("returns null 10% of the time with column of type decimal with allowNulls=true", function(){
    var TEST_NUMBER = 1000;
    var totalForAverage = 0;
    for(var j = 1; j <= TEST_NUMBER ; j++) {
      if(getRandomData({dataType: "decimal", allowNulls: true}) == null) {
        totalForAverage++;
      }
    }
    expect(totalForAverage / TEST_NUMBER).to.be.above(.06).and.below(.14);
  })
});
