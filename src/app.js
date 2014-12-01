global.scriptsFolder = __dirname + "/../scripts/";
global.pagesFolder = __dirname + "/../gh-pages/";
global.winston = require('winston');
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {
    colorize: true,
    timestamp: true
});

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var github = require('./routes/github');

var app = express();

if (process.env.environment == "development") {
    app.use('/admin', express.static(path.join(__dirname, '/client/')));
    app.use('/admin', express.static(path.join(__dirname, '/client/.tmp')));
    app.use('/admin', express.static(path.join(__dirname, '/client/app')));

}
if (process.env.environment == 'production') {
    app.use('/admin', express.static(path.join(__dirname, '/dist')));
}

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({ extended: false, limit:'5mb' }));
app.use(cookieParser());




app.use('/github', github);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers


module.exports = app;
