var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var db = require('./db');

var index = require('./routes/index');
var dashboard = require('./routes/dashboard');
var graphs = require('./routes/graphs');
var controls = require('./routes/controls');
var maps = require('./routes/maps');
var map = require('./routes/map')
var users = require('./routes/users');
var info = require('./routes/info');
var login = require('./routes/login');
var ttnconfig = require('./TTNKeys.json');
var ttn = require('ttn');

passport.use(new Strategy(
  function(username, password, cb) {
    db.users.findByUsername(username, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      return cb(null, user);
    });
}));

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  db.users.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

var app = express();

const isProduction = 'production' === process.env.NODE_ENV;

// connect to MongoDB
var mongoDB = 'mongodb://localhost:27017/ballon-express';
mongoose.Promise = global.Promise;
mongoose.connect(mongoDB, {
  useMongoClient: true
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Connect to TTN to receive and send messages
/*
ttn.data(ttnconfig.appID, ttnconfig.accessKey)
  .then(client => {
    client.on("uplink", function(devId, payload){
      console.log("Received uplink from: " + devId);
      console.log("Payload: " + JSON.stringify(payload));
      console.log("Decoded data: " + JSON.stringify(payload.payload_fields));
    });
  })
  .catch(()=> {
    console.error.bind(console, 'TTN connection error');
  });
*/

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/dashboard', dashboard);
app.use('/maps', maps);
app.use('/map', map);
app.use('/users', users);
app.use('/graphs', graphs);
app.use('/controls', controls);
app.use('/info', info);
app.use('/login', login);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
