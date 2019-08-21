var express = require('express');
var router = express.Router();
var mongoose=require('mongoose');
var passport=require('passport');
var LocalStrategy=require('passport-local');
var User=require('../models/user-model');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.ejs');
});

router.get('/register',function (req,res) {
    res.render('register.ejs');
});


router.post('/register',function (req,res) {
    var newUser=new User({username: req.body.username});
    User.register(newUser,req.body.password,function (err,user) {
        if(err){
            console.log(err.message);
            req.flash("error",err.message);
            return res.render('register.ejs');
        }
        passport.authenticate('local')(req,res,function () {
            req.flash("success","Welcome " + user.username);
            res.redirect('/');
        });
    });
});

router.get('/login',function (req,res) {
    res.render('login.ejs');
});
//middleware
router.post('/login', passport.authenticate("local",
    {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: 'Invalid username or password.',
        successFlash: 'Welcome!'
    }),function (req,res) {
});

//logout route
router.get('/logout',function (req,res) {
    req.logout();
    res.redirect('/campgrounds');
});




module.exports = router;
