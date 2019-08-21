require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser=require('body-parser');
var mongoose=require('mongoose');
var methodOverride=require("method-override");
var passport=require('passport');
var LocalStrategy=require('passport-local');
var flash=require('connect-flash');
var User=require('./models/user-model');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var facilitiesRouter=require('./routes/facilities');
var commentsRouter=require('./routes/comments');
var app = express();

//database setup
mongoose.connect('mongodb://localhost:27017/JSports',{ useNewUrlParser: true },function (err) {
    if(err){
        console.log('not connected');
    }
    else {
        console.log('conected');
    }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({extended: true}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride("_method"));
app.use(flash());

app.locals.moment = require('moment');

// passport configuration
app.use(require('express-session')({
    secret: "dejnd1s",
    resave: false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function (req,res,next) {
    res.locals.currentUser=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
});


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/facilities/:id/comments',commentsRouter);
app.use('/facilities',facilitiesRouter);

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

module.exports = app;
