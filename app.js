var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./router');

// var webpack = require('webpack');
// var config = require('./webpack.dev.config');
// var {build} = require('vue-webpack');
// var {devServer} = require('express-vue-dev');

var app = express();

// var middleware = devServer({
//   server: build({
//     mode: 'server',
//     inputFilePath: `./src/main.js` // Vue application entry file for server-side
//   }),
//   client: build({
//     mode: 'client',
//     outputFileName: 'bundle',
//     outputPath: './dist',
//     publicPath: '/dist/',
//     // splitStyle: false,
//     inputFilePath: `./src/main.js` // Vue application entry file for client-side
//   })
// });
// app.use(middleware);

// var compiler = webpack(config);
//
// app.use(require('webpack-dev-middleware')(compiler, {
//   publicPath: config.output.publicPath,
//   historyApiFallback: true,
//   // noInfo: true,
//   watchOptions: { ignored: /node_modules/ },
//   stats: {
//     colors: true,
//     modules: false,
//     children: false,
//     chunks: false,
//     chunkModules: false
//   }
// }));
// app.use(require('webpack-hot-middleware')(compiler, {
//     // log: console.log
// }));

// view engine setup
app.set('views', path.join(__dirname, './jade-views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// app.use( [URL path],  express.static( relative file path ) )
app.use('/index.html', express.static('./index.html'));
app.use('/quickData.csv', express.static('./quickData.csv'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/dist', express.static(path.join(__dirname, 'dist')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
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


module.exports = app;
