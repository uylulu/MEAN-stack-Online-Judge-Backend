var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose 	= require('mongoose');
var passport = require('passport');
var compilex = require('compilex');
var options = {stats : true};
require('dotenv').config()

compilex.init(options);



const config = require('./config/server-config');
var middleware = require('./config/middleware');
var usersRouter = require('./routes/userRouter');
var dbRouter = require('./routes/dbRouter');

mongoose.connect(config.db.url);

var app = express();

var cors = require('cors')

app.use(cors()) // Use this after the variable declaration

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(passport.initialize());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/user', usersRouter);
app.use('/db', middleware.authenticate, dbRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

app.listen(3000, () => {
  console.log("Server is running on port 3000")
})