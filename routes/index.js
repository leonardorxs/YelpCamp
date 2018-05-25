const express = require("express"),
  router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const middleware = require("../middleware");

//ROOT ROUTE
router.get("/", function (req, res) {
  res.render("landing");
});

//show register form
router.get("/register", middleware.isLoggedOut, function (req, res) {
  res.render("register");
});

//handle signup logic
router.post("/register", middleware.isLoggedOut, function (req, res) {
  var newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      req.flash("error", err.message);
      return res.redirect("back");
    }
    passport.authenticate("local")(req, res, function () {
      req.flash("success", "Seja bem-vindo, " + req.user.username + ". Você foi cadastrado com sucesso!");
      res.redirect("/campgrounds");
    });
  });
});

//login form
router.get("/login", middleware.isLoggedOut, function (req, res) {
  res.render("login");
});

//FACEBOOK LOGIN
router.get('/auth/facebook', passport.authenticate('facebook'));
router.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/campgrounds',
    failureRedirect: '/register'
  }));

//handle login logic // passport.authenticate is a callback that takes care of everything 
router.post("/login", middleware.isLoggedOut, passport.authenticate("local",
  {
    successRedirect: "campgrounds",
    failureRedirect: "/login",
    failureFlash: 'Usuário ou senha inválidos',
    successFlash: 'Seja bem-vindo de volta'
  }));

//logout
router.get("/logout", middleware.isLoggedIn, function (req, res) {
  req.logout();
  req.flash("warning", "Você foi deslogado!");
  res.redirect("/login");
});

router.get("/about", function(req, res){
  res.render("about");
})

module.exports = router;