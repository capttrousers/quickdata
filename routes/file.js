var path = require('path');
var express = require('express');
var router = express.Router();
var _ = require('lodash');

var logger   = require('../utils/logger').logger;
var models = require('../models');
var processColumns = require('../utils/processColumns');
var generateData = require('../utils/generateData');
var isValidBody = require('../utils/isValidBody');

var testing   = process.env.NODE_TESTING || false;


router.post("/", function(request, response, next) {
  // logger.info('POST on /fileuploader with file %j', request.body);
  if( ! isValidBody(request.body) ) {
    logger.info('bad request (400), body property is missing something')
    response.status(400).type('json').send({error: 'request body missing something'});
  } else {
    // next();
    response.status(200).end();
  }
});
module.exports = router;
