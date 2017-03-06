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
