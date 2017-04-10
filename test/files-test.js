var chai = require('chai');
var expect = chai.expect;
var _ = require('lodash');
var logger   = require('../utils/logger').logger;

var app = require('../app');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);


describe('server accepts a text or json file to describe schema', function(){
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

  describe('accepts a file and returns 200 with usage info and 400 with missing values', function() {

      it('well formed body with usage info attrs is accepted on api and returns 200', function () {});
      it('body with main file attr with well formed body object is accepted on api and returns 200', function () {});
      it('body missing attr usage info attrs is rejected on api and returns 400', function () {});
      it('body with more than one file column is rejected on api and returns 400', function () {});
      it('body missing attr usage info attrs is rejected on api and returns 400', function () {});
      it('body missing attr usage info attrs is rejected on api and returns 400', function () {});
  })

  it('explodes a string by the newline characters', function() {
    var str = "a\nb\nc\nd";
    expect(_.split(str, '\n')).to.have.lengthOf(4).and.be.an('array');
  })

  it('counts pipes in the string', function() {
    var text = "one\n|two\n|\n|three\n|four"
    expect(text.match(/\|/g)).to.have.lengthOf(4);
  })

  it('replaces pipes in the string using lodash', function() {
    var text = "one\n|two\n|\n|three\n|four";
    var mod = _.replace(text, /\|/g, ' ');
    expect(mod.indexOf('|')).to.equal(-1);
  })
});
