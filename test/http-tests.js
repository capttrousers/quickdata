var chai = require('chai');
var expect = chai.expect;
var _ = require('lodash');
var logger   = require('../server/utils/logger').logger;

var processTables = require('../server/utils/cleaner/processTables');

var models = require('../server/models');
var body = require('../data/bodyTesterNoFiles');
var app = require('../server/app');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);

describe("HTTP requests", function() {
  before(function() {
    logger.info("Begin http request tests");
    this.timeout(10000);
    return models.sequelize.sync().then(() => {
     return models.Usage.findAll({
       attributes: ['id', 'TableName', 'DataSource', 'DeleteOn', 'Deleted'],
        where: {
         Deleted: false,
         DataSource : {
           $not: 'csv'
         }
       }
     });
    }).then(function (tables) {
      logger.info('found ' + tables.length + ' table(s) to delete from testing sqlite sb, before testing POST /quickdata');
      if(tables.length > 0) {
        return processTables(tables);
      }
    }).catch((err) => {
     logger.info("error while syncing db for table cleaner: " + err);
    });
  });

  after('clears out testing usage db after tests', function() {
     this.timeout(5000);
     return models.sequelize.sync().then(() => {
        return models.Usage.findAll({
         attributes: ['id', 'TableName', 'DataSource', 'DeleteOn', 'Deleted'],
          where: {
           Deleted: false,
           DataSource : {
             $not: 'csv'
           }
         }
       });
     }).then(function (tables) {
       logger.info('found ' + tables.length + ' tables to delete from testing sqlite sb, after testing POST /quickdata');
       if(tables.length > 0) {
         return processTables(tables);
       }
     }).catch((err) => {
       logger.info("error while syncing db for table cleaner: " + err);
     });
  });

  describe("quick data api", function() {

    it("GET / returns status 200 and be html", function() {
      return chai.request(app).get('/').then(function(response) {
        expect(response).to.have.status(200).and.to.be.html;
      });
      // return expect(chai.request(app).get('/')).to.have.status(200);
    });

  });

  // use morgan to test and log http requests
  describe("Process quickdata post", function() {
    this.slow(1000);
    this.timeout(10000);

    it("POST /quickdata with no parameters is rejected as Bad Request (400)", function() {
      return chai.request(app).post('/quickdata').catch(function(err) {
          expect(err.response).to.have.status(400);
          expect(err.response).to.have.property('body');
          expect(err.response.body).to.have.property('error', 'invalid body metadata');
      });
    });

    it("POST /quickdata with csv data source returns csv text", function() {
      return chai.request(app).post('/quickdata').send(body).then(function(res) {
        expect(res).to.have.status(200);
        // text bc csv is text/plain
        expect(res).to.be.text;
        expect(res).to.have.property('text');
        var newLineCount = (res.text.match(/\n/g) || []).length;
        // subtract 0 to convert string to int
        expect(newLineCount).to.equal(body.numberOfRecords - 0);
      });
    });

    it("drops the test table in case it still exists from previous tests", function() {
      return models["postgresConnection"].getQueryInterface().dropTable(body.sfCase + "_" + body.tableName);
    });

    it("POST /quickdata with postgres data source returns text file with 16 newline chars", function() {
      body.dataSource = 'postgres';
      logger.info('body length, for first schema for new table : ' + body.columns.length)
      return chai.request(app).post('/quickdata').send(body).then(function(res) {
        expect(res).to.have.status(200);
        // text bc csv is text/plain
        expect(res).to.be.text;
        expect(res).to.have.property('text');
        var newLineCount = (res.text.match(/\n/g) || []).length;
        expect(newLineCount).to.equal(17);
      });
    });

    it('checks the postgres db to verify the table exists', function() {
        return models[body.dataSource + "Connection"].getQueryInterface().describeTable(body.sfCase + "_" + body.tableName);
    });

    it("POST /quickdata with a different postgres data source to test describe new table", function() {
      var body2 = _.clone(body);
      body2.tableName = 'http_test_table2';
      body2.sfCase = '00000011';
      logger.info('body length, for second schema for existing table : ' + body2.columns.length)
      return chai.request(app).post('/quickdata').send(body2).then(function(res) {
        expect(res).to.have.status(200);
        // text bc csv is text/plain
        expect(res).to.be.text;
        expect(res).to.have.property('text');
        var newLineCount = (res.text.match(/\n/g) || []).length;
        expect(newLineCount).to.equal(17);
      });
    });

    // it('checks the postgres db to verify the table exists', function() {
        // body.dataSource = 'postgres';
        // return models[body.dataSource + "Connection"].getQueryInterface().describeTable(body.tableName).then((attrs) => {
          // expect(Object.keys(attributes).sort() != Object.keys(attrs).sort())
    // });

    it('POST /quickdata gets rejected with different schema than existing table', function() {
        body.dataSource = 'postgres';
        body.columns.push({
          "dataType": "decimal",
          "maxValue": "100",
          "minValue": "0",
          "interval": "1",
          "increment": "1",
          "trend": "positive",
          "allowNulls": false,
          "hierarchy": "none",
          "child": {}
        });
        logger.info('body columns length : ', body.columns.length);
        return chai.request(app).post('/quickdata').send(body).catch(function(err) {
          logger.info('error response status : ', err.response.status);
          expect(err.response).to.have.status(400);
          // expect(err.response).to.have.property("body");
          // expect(err.response.body).to.have.property('error', 'table exists with a schema incompatible with request');
      });
    });


  });

});
