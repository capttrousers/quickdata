var chai = require('chai');
var expect = chai.expect;
var _ = require('lodash');
var logger   = require('../server/utils/logger').logger;

var app = require('../server/app');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);


describe.skip('server accepts a text or json file to describe schema', function(){

  it('POST /fileuploader accepts anything and returns 200', function(){
    var body = {
        file: 'test'
    }
    return chai.request(app).post('/fileuploader').send(body).catch(function(err) {
      expect(err).to.have.status(400);
      expect(err.response.body).to.have.property("error").that.is.a("string");
      expect(err.response.body.error).to.equal("TWB file uploaded with errors");
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
