global.scriptsFolder = __dirname + "/../scripts/";
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

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({ extended: false, limit:'5mb' }));
app.use(cookieParser());

if (process.env.environment == "development") {
    app.use(morgan('dev',{
        skip: function (req, res) {
            if (res.statusCode == 200) {
                return req.baseUrl == "/admin";
            }
        }
    }));

    app.use('/admin', express.static(path.join(__dirname, '/client/')));
    app.use('/admin', express.static(path.join(__dirname, '/client/.tmp')));
    app.use('/admin', express.static(path.join(__dirname, '/client/app')));

}
if('production' == app.get('env')) {
    app.use('/admin', express.static(path.join(__dirname, '/dist')));
}

app.use('/', routes);
app.use('/github', github);



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
