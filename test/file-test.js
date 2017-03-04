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
    return chai.request(app).post('/fileuploader').send(body).then(function(res) {
      expect(res).to.have.status(200);
      // expect(res).to.be.text;
      // expect(res).to.have.property('text');
      // var count = (res.text.match(/\n/g) || []).length;
      // expect(count).to.equal(body.maxRows);
    });
  });

  it('explodes a string', function() {
    var str = "abcd";
    expect(_.split(str, '')).to.have.lengthOf(4).and.be.an('array');
  })
});
