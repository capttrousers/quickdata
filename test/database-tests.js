var chai = require('chai');
var expect = chai.expect;
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

var models = require('../models');

var logger   = require('../utils/logger').logger;

var processTables = require('../utils/cleaner/processTables');

describe("Database connections with sequelize", function() {

  this.slow(500);
  before('clears out testing usage db to run clean tests', function() {
    this.timeout(10000);
     return models.sequelize.sync().then(() => {
         return models.Usage.findAll({
           attributes: ['id', 'TableName', 'DataSource', 'DeleteOn', 'Deleted'],
           // potentially remove this and do the processing of the entire results
           // if this check doesn't work properly
            where: {
             Deleted: false,
             DataSource : {
               $not: 'csv'
             }
           }
         });
       }).then(function (tables) {
         logger.info('found ' + tables.length + ' tables to delete from testing sqlite sb');
          return processTables(tables);
       }).catch((err) => {
         logger.info("error while syncing db for table cleaner: " + err);
       });
  });

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
    var name = 'db_test_table1';
    var sfCase =  '00000';
    var tableName = sfCase + '_' + name;
    var attrs = {
      'String Column': models.Sequelize.STRING,
      'Date Column': models.Sequelize.DATE,
      'Integer Column': models.Sequelize.INTEGER,
      'Double Column': models.Sequelize.DOUBLE
    };
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
    ];

    describe("creates a table in mysql db", function() {

      var seq = models.mysqlConnection;
      it("creates table in a mysql database", function() {
        return seq.getQueryInterface().createTable(tableName, attrs);
      });

      it('adds data to the table', function () {
        // values are an array of objects, each object is row with key value pairs
        return seq.getQueryInterface().bulkInsert(tableName, data);
      });

      it('checks database to make sure the table exists', function() {
        return expect(models['mysqlConnection'].getQueryInterface().describeTable(tableName)).to.eventually.have.all.keys({
          'String Column': models.Sequelize.STRING,
          'Date Column': models.Sequelize.DATE,
          'Integer Column': models.Sequelize.INTEGER,
          'Double Column': models.Sequelize.DOUBLE
        });
      });

    });

    describe("logs that table in the Usage db with a delete date of today", function() {

      it('adds a table to the testing usage db with a delete on of today for mysql', function() {
        var now = new Date();
        return models.Usage.create({
          User: user,
          TableName: tableName,
          SFCase: sfCase,
          DataSource: 'mysql',
          Created: now,
          DeleteOn: now
        });
      });

      it('checks usage table to see if previously made table exists with deleted = false', function() {
        return expect( models.Usage.findAll({
          where: {
            SFCase: sfCase,
            TableName: tableName,
            User: user,
            Deleted: false
          }
        })).to.eventually.have.length.above(0);
      });

      // table cleaner .js deletes table in sql db and logs table as deleted in Usage table
      it('cleans previously made table in testing usage table and sql database', function() {
       this.slow(5000);
       return models.Usage.findAll({
         where: {
           SFCase: sfCase,
           TableName: tableName,
           User: user,
           Deleted: false
         }
       }).then((tables) => {
          return processTables(tables);
       });
      });

      it('checks usage table to make sure there are no tables in test usage db w/ Deleted = 0', function() {
        return expect( models.Usage.findAll({
          where: {
            SFCase: sfCase,
            TableName: tableName,
            User: user,
            Deleted: false
          }
        })).to.eventually.have.lengthOf(0) ;
      });

      it('checks database to make sure the table was deleted', function() {
        return expect(models['mysqlConnection'].getQueryInterface()
          .describeTable(tableName)).to.eventually.be.rejectedWith(/table.*does.?n.?t.*exist/i);
      });

    });

  });

});
