var chai = require('chai');
var expect = chai.expect;

var models = require('../models');
var app = require('../app');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);

describe("HTTP requests", function() {

  describe("quick data api", function() {

    it('GET / redirects', function() {
			return chai.request(app).get('/').then(function(response) {
				expect(response).to.redirect;
			});
    })

    it("GET / returns status 200 and be html", function() {
      return chai.request(app).get('/').then(function(response) {
        expect(response).to.have.status(200).and.to.be.html;
      });
      // return expect(chai.request(app).get('/')).to.have.status(200);
    });

  });

  // use morgan to test and log http requests
  describe("Process quickdata post", function() {
    this.slow(500);

    // does it actually default to values: ?
    // defaults to acceptable values if none are given
    // for user, rows, data source, table name, sf case

    var body = {};
    body.user = 'testUser1';
    body.tableName = 'http_test_table';
    body.dataSource = 'csv';
    body.sfCase = '98765';
    body.columns = [
      {
        "dataType": "text",
        "maxValue": "5",
        "interval": "1",
        "hierarchy": "none",
        "child": {}
      },{
        "dataType": "integer",
        "maxValue": "100",
        "interval": "1",
        "hierarchy": "none",
        "child": {}
      },{
        "dataType": "date",
        "maxValue": "2010-03-05",
        "interval": "1",
        "hierarchy": "none",
        "child": {}
      }
    ];
    body.maxRows = 5;


    it.only("POST /quickdata with no parameters is rejected as Bad Request (400)", function() {
      return chai.request(app).post('/quickdata').catch(function(err) {
          expect(err.response).to.have.status(400);
          expect(err.response).to.have.property('body');
          expect(err.response.body).to.have.property('error', 'request body missing something');
      });
    });


    it("POST /quickdata with csv data source returns csv text", function() {
      return chai.request(app).post('/quickdata').send(body).then(function(res) {
        expect(res).to.have.status(200);
        // text bc csv is text/plain
        expect(res).to.be.text;
        // var count = (res.body.match(/\n/g) || []).length;
        // expect(count).to.equal(6);
      });
    });


    it("drops the test table in case it still exists from previous tests", function() {
      return models["mysqlConnection"].getQueryInterface().dropTable(body.sfCase + "_" + body.tableName);
    });

    it("POST /quickdata with mysql data source returns text file with X newline chars", function() {
      body.dataSource = 'mysql';
      return chai.request(app).post('/quickdata').send(body).then(function(res) {
        expect(res).to.have.status(200);
        // text bc csv is text/plain
        expect(res).to.be.text;
        expect(res).to.have.property('body');
        // var count = (res.body.match(/\n/g) || []).length;
        // expect(count).to.equal(6);
      });
    });

    it('checks the mysql db to verify the table exists', function() {
        body.dataSource = 'mysql';
        return models[body.dataSource + "Connection"].getQueryInterface().describeTable(body.sfCase + "_" + body.tableName);
    });

    // it.skip('checks the mysql db to verify the table exists', function() {
    //     body.dataSource = 'mysql';
    //     return models[dataSource + "Connection"].getQueryInterface().describeTable(tableName).then((attrs) => {
    //       expect(Object.keys(attributes).sort() != Object.keys(attrs).sort())
    // });




    it.only('POST /quickdata gets rejected with different schema than existing table', function() {
        body.dataSource = 'mysql';
        body.columns.push({
          "dataType": "decimal",
          "maxValue": "100",
          "interval": "1",
          "hierarchy": "none",
          "child": {}
        });
        return chai.request(app).post('/quickdata').send(body).catch(function(err) {
          expect(err.response).to.have.status(400);
          expect(err.response).to.have.property("body");
          expect(err.response.body).to.have.property('error', 'table exists with a schema incompatible with request');
      });
    });


  });

});
