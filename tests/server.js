


describe("Quickdata generator", function() {

  describe("quick data api", function() {

    it("returns status 200", function() {});

    it("writes a csv file to disk", function() {});

  });

  describe("sequelize connections", function() {

    it("authenticates all db connections", function() {});

    it("creates a table in each db", function() {});

    it("logs that table in the Usage db with a delete date of today", function() {});

    it("checks logs in the Usage db to delete that table", function() {});

  });

  // use morgan to test and log http requests
  describe("Process quickdata post", function() {

    it("accepts connections on POST /quickdata", function() {});

    it("process column data to create array of data models", function() {});

    // check the intervals for each column, get data value or new random data
    it("row of data, one random value for each column", function() {});

  });

  describe("Random data generator", function() {

    // needs to check datatype, max/min, any other constraints
    it("takes an object for the columns data model", function() {});

    // does value match data type and constraints
    it("generates a random value based on data model", function() {});

  });

});
