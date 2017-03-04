var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var file = require('./routes/file');
var logger   = require('./utils/logger').logger;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, './pug-views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
if(! process.env.NODE_TESTING) {
  if(process.env.NODE_ENV == 'production') {
    app.use(morgan('combined'));
  } else {
    logger.info('using morgan:dev')
    app.use(morgan('dev'));
  }
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// app.use( [URL path],  express.static( relative file path ) )
// app.use('/index.html', express.static('./index.html'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'dist')));

app.use('/', routes);
app.use('/fileuploader', file);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers if not testing
if(! process.env.NODE_TESTING) {
  // development error handler
  // will print stacktrace
  if (app.get('env') === 'development' ) {
    console.log("NODE_ENV = " + process.env.NODE_ENV);
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err
      });
    });
  }

  // production error handler
  // no stacktraces leaked to user

  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });
}

module.exports = app;
