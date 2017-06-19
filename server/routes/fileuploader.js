var path = require('path');
var express = require('express');
var router = express.Router();
var _ = require('lodash');
var archiver = require('archiver');
var logger   = require('../utils/logger').logger;

var twb2schema = require("../utils/twb2schema")
var testing   = process.env.NODE_TESTING || false;


router.post("/", function(request, response) {
  logger.debug("POST to /fileuploader");

  if(request.body.twb == null || request.body.twb == undefined) {
    logger.debug("POST to /fileuploader with null or undefined body.twb");
    response.status(400).type("json").send({"error" : "TWB file uploaded with errors"});
  } else {

    var connections = twb2schema(request.body.twb);
    logger.debug("parsed twb json to connections schema");

    if(connections == null || connections == undefined || connections.length == 0) {
      logger.debug("parsed twb json is null, undefined or length == 0");
      response.status(400).type("json").send({"error" : "TWB file parsed to have no connections or other error"});
    }
    var zip = archiver("zip");
    response.type("application/zip");

    zip.on("error", (err) => {
      logger.debug("zip error in /fileuploader:", err)
      response.status(400).type("json").send({"error" : err});
    });

    zip.pipe(response);
    connections.forEach((ds) => {
      var schema = {
        numberOfRecords: 500,
        dataSource: "csv",
        user: "somebody@tableau.com"
      }
      logger.debug("ds.tablename:", ds.tablename);
      schema.tableName = ds.tablename
      schema.columns = [];
      ds.fields.forEach((field) => {
        var column = {}
        logger.debug("ds.field['local-name']:", field["local-name"]);
        column.name = field["local-name"].replace(/[\[\]]/g, "");
        column.count = 1;
        column.file = null;
        column.hierarchy = "none";
        column.behavior = "random";
        logger.debug("ds.field['contains-null']:", field["contains-null"]);
        column.allowNulls = (field["contains-null"] == "true")
        logger.debug("ds.field['local-type']:", field["local-type"]);
        switch(field["local-type"]) {
          case "date" :
          case "datetime" :
            column.dataType = "date"
            column.minValue = "2000-01-01"
            column.maxValue = new Date().toISOString().substring(0,10);
            break;
          case "integer" :
            column.dataType = "integer"
            column.minValue = 0
            column.maxValue = 1000
            break;
          case "real" :
            column.dataType = "decimal"
            column.minValue = 0
            column.maxValue = 1000
            break;
          case "string" :
            column.dataType = "text"
            column.minValue = 1
            column.maxValue = 15
            break;
        }
        schema.columns.push(column);
        logger.debug("schema.columns.length:", schema.columns.length);
      })
      zip.append(JSON.stringify(schema, null, 1), {name: ds.tablename + ".json"});
    });
    zip.finalize();

  }
});
module.exports = router;
