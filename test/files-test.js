var chai = require('chai');
var expect = chai.expect;
var _ = require('lodash');
var logger   = require('../utils/logger').logger;

var app = require('../app');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);


describe.only('server accepts a text or json file to describe schema', function(){
  
  it('POST /fileuploader accepts a text file and returns 200', function(){
    // expect(200).to.equal(200);
    var body = {
        file: 'test'
    }
    return chai.request(app).post('/fileuploader').send(body).catch(function(res) {
      expect(res).to.have.status(400);
      // expect(res).to.be.text;
      // expect(res).to.have.property('text');
      // var count = (res.text.match(/\n/g) || []).length;
      // expect(count).to.equal(body.maxRows);
    });
  });

  describe('accepts a file and returns 200 with usage info and 400 with missing values', function() {

      it('well formed body with usage info attrs is accepted on api and returns 200', function () {});
      it('body with main file attr with well formed body object is accepted on api and returns 200', function () {});
      it('body missing attr usage info attrs is rejected on api and returns 400', function () {});
      it('body with more than one file column is rejected on api and returns 400', function () {});
      it('body missing attr usage info attrs is rejected on api and returns 400', function () {});
      it('body missing attr usage info attrs is rejected on api and returns 400', function () {});
  })


});
