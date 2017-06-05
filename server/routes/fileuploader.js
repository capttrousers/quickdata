var path = require('path');
var express = require('express');
var router = express.Router();
var _ = require('lodash');

var logger   = require('../utils/logger').logger;

var testing   = process.env.NODE_TESTING || false;


router.post("/", function(request, response) {
  logger.info('POST on /fileuploader with file %j', request.body);
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
  
  
  response.status(200).type("json").send({"test" : 123});  
});
module.exports = router;
