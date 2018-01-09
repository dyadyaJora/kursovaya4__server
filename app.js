var express = require('express');
var path = require('path');

var app = express();
var appDriver = express();

appDriver.io = require('socket.io')();

appDriver.io.on('connection', (socket) => {
    socket.emit('test', 1);
    socket.on('disconnect', function(){
        appDriver.io.emit('users-changed', {user: socket.nickname, event: 'left'});   
    });
});

var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./config');

var routes = require('./routes/index');
var users = require('./routes/users');
var me = require('./routes/me');
var driversIndex = require('./routes/index-drivers');

var passport = require('passport');
var mongoose = require('mongoose');


require('./controllers/dbinit');
require('./models/user');
require('./models/order');
var User = mongoose.model('User');
var Order = mongoose.model('Order');


var order = require('./routes/order');
var orders = require('./routes/orders-drivers');
/*
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
*/
// uncomment after placing your favicon in /public
app.options(/\.*/, function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type", "Authorization");
    res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
    res.send(200);
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../taxi-service/www')));

appDriver.options(/\.*/, function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type", "Authorization");
    res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
    res.send(200);
});

appDriver.use(logger('dev'));
appDriver.use(bodyParser.json());
appDriver.use(bodyParser.urlencoded({ extended: false }));
appDriver.use(cookieParser());
appDriver.use(express.static(path.join(__dirname, '../taxi-drivers/www')));

app.use(passport.initialize());

var initPassport = require('./controllers/passport');
initPassport(passport);

app.use('/', routes);
app.use('/users', users(passport));
app.use('/me', me(passport));
app.use('/order', order(passport, appDriver.io));
app.use('/test', function(req, res) {
    console.log('TEST')
    res.json({ test:'success'});
});

app.use('/api/auth', require('./routes/auth')(passport));

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

// ===================================


appDriver.use('/', driversIndex);
appDriver.use('/orders', orders() );

appDriver.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

appDriver.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = { client: app, driver: appDriver};
