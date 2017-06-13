var path = require('path');
var express = require('express');
var router = express.Router();
var _ = require('lodash');
var archiver = require('archiver');
var logger   = require('../utils/logger').logger;

var twb2schema = require("../utils/twb2schema")
var testing   = process.env.NODE_TESTING || false;


router.post("/", function(request, response) {
  // logger.debug('POST on /fileuploader with file %j', request.body);
  /* 
  if( ! isValidBody(request.body) ) {
    logger.info('bad request (400), body property is missing something')
    response.status(400).type('json').send({error: 'request body missing something'});
  } else {
    // next();
    response.status(200).end();
  }
  */
  
  // file uploader will allow uploading .twb files to parse the XML and then create the schema.json file to then send to /quickdata
  // defaults to CSV file with datasource name from .twb 
  
  /*
    process twb json here
    use twbs.js method
    return connections array with tablename and fields
    for each connections
      create json
      zip.append(JSON.stringify(connection), {name: connection.tablename + ".json"})
      
    zip.finalize();
  
  */
  if(request.body.twb == null || request.body.twb == undefined) {
    response.status(400).type("json").send({"error" : "TWB file uploaded with errors"});
  }
  var connections = twb2schema(request.body.twb);
  
  if(connections == null || connections == undefined || connections.length == 0) {
    response.status(400).type("json").send({"error" : "TWB file parsed to have no connections or other error"});
  }
  var zip = archiver("zip");
  response.type("application/zip");
  
  zip.on("error", (err) => {
    response.status(400).type("json").send({"error" : err});
  });
  
  zip.pipe(response);
  connections.forEach((ds) => {
    var schema = {
      numberOfRecords: 500,
      dataSource: "csv",
      user: "somebody@tableau.com"
    }
    schema.tableName = ds.tablename
    schema.columns = [];
    ds.fields.forEach((field) => {
      var column = {}
      column.name = field["local-name"].replace(/[\[\]]/g, "");
      column.count = 1;
      column.file = null;
      column.hierarchy = "none";
      column.behavior = "random";
      column.allowNulls = (field["contains-null"] == "true")
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
        case "string" :
          column.dataType = "text"
          column.minValue = 1
          column.maxValue = 15
          break;
      }
      schema.columns.push(column);
    })
    zip.append(JSON.stringify(schema, null, 1), {name: ds.tablename + ".json"});
  });
  zip.finalize();
  
  
  // response.status(200).type("json").send({"test" : 123});  
});
module.exports = router;
