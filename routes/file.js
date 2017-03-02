var path = require('path');
var express = require('express');
var router = express.Router();
var _ = require('lodash');

var logger   = require('../utils/logger').logger;

var testing   = process.env.NODE_TESTING || false;

router.post("/", function(request, response, next) {
  logger.info('POST on /file');
  // logger.info('request body keys = %j',  Object.keys(request.body));
  response.status(200).end();
});

module.exports = router;
