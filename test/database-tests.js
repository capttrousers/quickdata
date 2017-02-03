var chai = require('chai');
var expect = chai.expect;
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

var models = require('../models');

// console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
// console.log('models will config the sqlite db to be in the same dir as the script is run (mocha runs in root)');
// also testing sqlite db will be used here

describe("Database connections with sequelize", function() {

  describe("authenticates all connections", function() {
    it("authenticates mysql connection", function() {
      return models.mysqlConnection.authenticate();
    });
    it("authenticates mssql connection", function() {
      return models.mssqlConnection.authenticate();
    });
    it("authenticates postgres connection", function() {
      return models.postgresConnection.authenticate();
    });
  });

  describe("creates a table in each db", function() {

    it("creates table in a mysql db", function() {

    });

  });

  describe("logs that table in the Usage db with a delete date of today", function() {

    var tableCleaner = require('../utils/cleaner/TableCleaner.js');

    var user = 'test@user.com';
    var name = 'test_table1';
    var sfCase =  '00000';
    var tableName = sfCase + '_' + name;

    it.skip('runs table cleaner', function() {
       return tableCleaner();
    })
    it('adds a table to the actual db', function() {
      expect(0).to.equal(1);
    })
    it('adds a table to the testing usage db with a delete on of today', function() {
      var now = new Date();
      return models.Usage.create({
        User: user,
        TableName: tableName,
        SFCase: sfCase,
        DataSource: 'mysql',
        Created: now,
        DeleteOn: now
        // try this if now doesnt work;
        // DeleteOn: new Date().setMonth(today.getMonth() - 1);
      })
    })

    it('checks usage table to see if previously made table exists with delete on today', function() {
      return expect( models.Usage.findAll({
        where: {
          SFCase: sfCase,
          TableName: tableName,
          User: user
        }
      })).to.eventually.have.length.above(0);
    });

    it.skip('runs table cleaner to deletes table in usage table, by setting deleted to true', function() {
     return tableCleaner().then(() => {
         return expect( models.Usage.findAll({
          where: {
            SFCase: sfCase,
            TableName: tableName,
            User: user,
            Deleted: false
          }
        })).to.eventually.have.lengthOf(0) ;
      });
    });
  });

});
