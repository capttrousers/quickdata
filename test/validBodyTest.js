var expect = require('chai').expect;

var logger   = require('../utils/logger').logger;

var isValidBody = require('../utils/isValidBody');

var dataColumnObject = require('../data/dataColumnObject');
var bodyTemplate = require('../data/bodyTemplate');

describe("Tests isValidBody method", function() {

  it("returns true with bodyTemplate.js file", function() {
    expect(isValidBody(bodyTemplate)).to.be.true;
  });

  it("returns false with dataColumnObject.js file at min and max", function() {
    var body = bodyTemplate;
    body.columns.push(dataColumnObject);
    expect(isValidBody(body)).to.be.false;

  });

});
