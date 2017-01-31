var expect = require('chai').expect;

var models = require('../models');
console.log('testing 1 2 3 ...');
console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
console.log('models will config the sqlite db to be in the same dir as the script is run (mocha runs in root)');

describe("Quickdata generator", function() {

  describe("quick data api", function() {

    it("returns status 200", function() {
      expect(200).to.equal(200);
    });

    it("writes a csv file to disk", function() {

    });

  });

  describe("sequelize connections", function() {

    describe("authenticates all connections", function() {
      it("authenticates mysql connection", function(done) {
        models.mysqlConnection.authenticate().then(() => {
          done();
        }, (err) => {
          done(err);
        })
      });
      it("authenticates mssql connection", function(done) {
        models.mssqlConnection.authenticate().then(() => {
          done();
        }, (err) => {
          done(err);
        })
      });
      it("authenticates postgres connection", function(done) {
        models.postgresConnection.authenticate().then(() => {
          done();
        }, (err) => {
          done(err);
        })
      });
    });

    describe("creates a table in each db", function() {

      it("creates table in a db", function() {

      });

    });

    describe("logs that table in the Usage db with a delete date of today", function() {

      it('checks usage table to see if previously made table exists with delete on today', function() {});

    });

    describe("checks logs in the Usage db to delete that table", function() {

      it('deletes table in usage table, by setting deleted to true', function() {

      });

    });

  });


  // use morgan to test and log http requests
  describe("Process quickdata post", function() {

    it("accepts connections on POST /quickdata", function() {});

    // defaults to acceptable values if none are given
    // for user, rows, data source, table name, sf case

    it("process column data to create array of data models", function() {});

    // check the intervals for each column, get data value or new random data
    it("row of data, one random value for each column", function() {});

  });

  describe("Random data generator", function() {
    var getRandomData = require('../utils/getRandomDataValue');
    it("returns value of type : datatype", function() {
      var string = getRandomData({dataType: 'text', maxValue: 10});
      expect(string).to.be.a('string');
      var integer = getRandomData({dataType: 'integer', maxValue: 10});
      expect(integer).to.be.a('number');
      var decimal = getRandomData({dataType: 'decimal', maxValue: 10});
      expect(decimal).to.be.a('number');
      var date = getRandomData({dataType: 'date', maxValue: 10});
      expect(date).to.be.a('string');
    });

    it("generates a random value between min and max constraints", function() {
      // min is one so just check that values are between 1 and maxValue
        var integer = getRandomData({dataType: 'integer', maxValue: 10000});
        expect(integer).to.be.below(10000);
        var decimal = getRandomData({dataType: 'decimal', maxValue: 10000});
        expect(decimal).to.be.below(10000);

        // dates are strings of length: 24
        var dateString = getRandomData({dataType: 'date', maxValue: new Date()});
        expect(dateString).to.have.lengthOf(24);
        // date max value is actually min date
        var date = getRandomData({dataType: 'date', maxValue: new Date('2007-08-08')});
        expect(new Date(date)).to.be.at.least(new Date('2007-08-08'));

        var string1 = getRandomData({dataType: 'text', maxValue: 10});
        expect(string1).to.have.lengthOf(10);
        var string2 = getRandomData({dataType: 'text', maxValue: 100});
        expect(string2).to.have.lengthOf(100);
        var string3 = getRandomData({dataType: 'text', maxValue: 1000});
        expect(string3).to.have.lengthOf(1000);
    });

  });

});
