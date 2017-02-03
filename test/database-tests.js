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
  
  describe("create quickdata table:", function() {
    // first define test table info to log, schema, and 'random' data
    var user = 'test@user.com';
    var name = 'test_table1';
    var sfCase =  '00000';
    var tableName = sfCase + '_' + name;
    var attrs = {
      'String Column': models.Sequelize.STRING,
      'Date Column': models.Sequelize.DATE,
      'Integer Column': models.Sequelize.INTEGER,
      'Double Column': models.Sequelize.DOUBLE
    }
    // data is an array of row objects, each row object is set of key value pairs for col name and tuple value
    var data = [
      {
      'String Column': 'Test value 1',
      'Date Column': new Date(),
      'Integer Column': 1,
      'Double Column': 2.71828
      },
      {
      'String Column': 'Test value 2',
      'Date Column': new Date(),
      'Integer Column': 2,
      'Double Column': 3.14159
      }
    ]
  
    describe("creates a table in each db", function() {

      it("creates table in a mysql db", function() {
        var seq = models.mysqlConnection;
        return seq.getQueryInterface().createTable(tableName, attrs).then( function () {
              // values are an array of objects, each object is row with key value pairs
              return seq.getQueryInterface().bulkInsert(tableName, data);
        });
      });
        
    });

    describe("logs that table in the Usage db with a delete date of today", function() {

      var tableCleaner = require('../utils/cleaner/TableCleaner.js');

      it('runs table cleaner', function() {
         return tableCleaner();
      });
      
      it('adds a table to the testing usage db with a delete on of today for mysql', function() {
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
        });
      });

      it('checks usage table to see if previously made table exists with delete on today', function() {
        return expect( models.Usage.findAll({
          where: {
            SFCase: sfCase,
            TableName: tableName,
            User: user
          }
        })).to.eventually.have.length.above(0);
      });

      it.skip('checks that db to make sure the table exists', function() {
        return expect(models['mysqlConnection'].getQueryInterface().describeTable(tableName)).to.eventually.not.be.empty;
      });
      
      it.skip('drops the table in the sql db', function() {
        return models['mysqlConnection'].getQueryInterface().dropTable(tableName);
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
});
