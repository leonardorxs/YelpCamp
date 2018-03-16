var express = require("express"),
    router  = express.Router();
var passport = require("passport");
var User = require("../models/user");

//ROOT ROUTE
  router.get("/", function(req, res){
    res.render("landing");
  });
  
//show register form
  router.get("/register", isLoggedOut, function(req,res){
    res.render("register");
  });

//handle signup logic
  router.post("/register", isLoggedOut, function(req, res) {
      var newUser = new User({username: req.body.username});
      User.register(newUser, req.body.password, function(err, user){
        if(err){
          console.log(err);
          return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
          res.redirect("/campgrounds");
        });
      });
  });
  
//login form
  router.get("/login", isLoggedOut, function(req, res) {
    res.render("login"); 
  });

//handle login logic // passport.authenticate is a callback that takes care of everything 
  router.post("/login", isLoggedOut, passport.authenticate("local", 
    {
      successRedirect: "/campgrounds",
      failureRedirect: "/login"
    }));
  
  //logout
  router.get("/logout", isLoggedIn, function(req, res) {
    req.logout();
    res.redirect("/login");
  });


  function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect("/login");
  }
  
  function isLoggedOut(req, res, next){
    if(!req.isAuthenticated()){
      return next();
    }
    res.redirect("/");
  }

  module.exports = router;