  var expect = require('chai').expect;
  
  describe("Random data generator", function() {
    var getRandomData = require('../utils/getRandomDataValue');
    it("returns value of type : datatype", function() {
      var string = getRandomData({dataType: 'text', maxValue: 10});
      expect(string).to.be.a('string');
      var integer = getRandomData({dataType: 'integer', maxValue: 10});
      expect(integer).to.be.a('number');
      var decimal = getRandomData({dataType: 'decimal', maxValue: 10});
      expect(decimal).to.be.a('number');
      var date = getRandomData({dataType: 'date', maxValue: 10});
      expect(date).to.be.a('string');
    });

    it("generates a random value between min and max constraints", function() {
      // min is one so just check that values are between 1 and maxValue
        var integer = getRandomData({dataType: 'integer', maxValue: 10000});
        expect(integer).to.be.below(10000);
        var decimal = getRandomData({dataType: 'decimal', maxValue: 10000});
        expect(decimal).to.be.below(10000);

        // dates are strings of length: 24
        var dateString = getRandomData({dataType: 'date', maxValue: new Date()});
        expect(dateString).to.have.lengthOf(24);
        // date max value is actually min date
        var date = getRandomData({dataType: 'date', maxValue: new Date('2007-08-08')});
        expect(new Date(date)).to.be.at.least(new Date('2007-08-08'));
        expect(new Date(date)).to.be.at.most(new Date());

        var string1 = getRandomData({dataType: 'text', maxValue: 10});
        expect(string1).to.have.lengthOf(10);
        var string2 = getRandomData({dataType: 'text', maxValue: 100});
        expect(string2).to.have.lengthOf(100);
        var string3 = getRandomData({dataType: 'text', maxValue: 1000});
        expect(string3).to.have.lengthOf(1000);
    });

  });