var chai = require('chai');
var expect = chai.expect;

var models = require('../models');
var app = require('../app');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var chaiHttp = require('chai-http');
chai.use(chaiHttp);

describe("Quickdata generator", function() {

  describe("quick data api", function() {

    it('GET / redirects', function() {
      return expect(chai.request(app).get('/')).to.eventually.redirect;
    })

    it("GET / returns status 200 and be html", function() {
      chai.request(app).get('/').then(function(response) {
        expect(response).to.have.status(200).and.to.be.html;
      });
      // return expect(chai.request(app).get('/')).to.have.status(200);
    });

    it("returns status 200 and be html", function() {
      chai.request(app).get('/').then(function(response) {
        expect(response).to.have.status(200).and.to.be.html;
      });
      // return expect(chai.request(app).get('/')).to.have.status(200);
    });

  });




  // use morgan to test and log http requests
  describe("Process quickdata post", function() {
    this.slow(500);
    it("POST /quickdata with no parameters is rejected", function() {
      chai.request(app).post('/quickdata').catch(function(response) {
          expect(response).to.have.status(400);
      });
    });

    // does it actually default to values: ?
      // defaults to acceptable values if none are given
      // for user, rows, data source, table name, sf case

    var body = {};
    body.user = 'testUser1';
    body.tableName = 'testFile';
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
      },{
        "dataType": "decimal",
        "maxValue": "100",
        "interval": "1",
        "hierarchy": "none",
        "child": {}
      }
    ];
    body.maxRows = 5;

    it.only("POST /quickdata with valid parameters returns valid json with max rows", function() {
      chai.request(app).post('/quickdata').send(body).then(function(res) {
        expect(res).to.have.deep.property('maxRows', 6);
      });
    });

    // check the intervals for each column, get data value or new random data
    it("row of data, one random value for each column", function() {
      chai.request(app).post('/quickdata').send(body).then(function(response) {
        // expect(response).to.equal(1);
        // expect(response).to.have.deep.property('data.columns')
        //         .that.is.an('array').with.lengthOf(4);
      });
    });

  });



});
