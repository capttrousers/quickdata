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

    it('redirects', function() {
       return expect(chai.request(app).get('/')).to.eventually.redirect;
    })

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
    it("rejects on POST /quickdata with no post parameters", function() {
      return expect(chai.request(app).post('/quickdata')).to.be.rejected;
    });

    // does it actually default to values: ?
      // defaults to acceptable values if none are given
      // for user, rows, data source, table name, sf case

    it("process column data to create array of data models", function() {  });

    // check the intervals for each column, get data value or new random data
    it("row of data, one random value for each column", function() {  });

  });



});
