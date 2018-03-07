var chai = require('chai');
var expect = chai.expect;
var faker = require("faker");

describe("checks various faker random data values", function() {

  describe("address category", function() {

      it("returns a zip code that is a string, can be 5 digit or full zip", function () {
        expect(faker.address.zipCode()).to.be.a("string");
      });

      it("returns a city that is a string", function () {
        expect(faker.address.city()).to.be.a("string");
      });

      it("returns a street name that is a string", function () {
        expect(faker.address.streetName()).to.be.a("string");
      });

      it("returns a street address that is a string", function () {
        expect(faker.address.streetAddress()).to.be.a("string");
      });

      it("returns a street suffix that is a string", function () {
        expect(faker.address.streetSuffix()).to.be.a("string");
      });

      it("returns a county that is a string", function () {
        expect(faker.address.county()).to.be.a("string");
      });

      it("returns a country that is a string", function () {
        expect(faker.address.country()).to.be.a("string");
      });

      it("returns a state that is a string", function () {
        expect(faker.address.state()).to.be.a("string");
      });

      it("returns a state abbreviation that is a string", function () {
        expect(faker.address.stateAbbr()).to.be.a("string").and.have.lengthOf(2);
      });

      it("returns a latitude that is a string", function () {
        expect(faker.address.latitude()).to.be.a("string");
      });

      it("returns a longitude that is a string", function () {
        expect(faker.address.longitude()).to.be.a("string");
      });

  })

  describe("commerce category", function() {

  })

  describe("company category", function() {

  })

  describe("date category", function() {

  })

  describe("finance category", function() {

  })

  describe("internet category", function() {

  })

  describe("name category", function() {

  })

  describe("phone category", function() {

      it("returns a phone number that is a string", function () {
        expect(faker.phone.phoneNumber()).to.be.a("string");
      });

  })

  describe("random category", function() {

  })

  describe("system category", function() {

  })


});
