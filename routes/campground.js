var express = require("express"),
    router  = express.Router();
var moment  = require("moment");
moment.locale('pt-br');  
var Campground = require("../models/campground");

//INDEX - SHOW ALL CAMPGROUNDS
router.get("/", function(req, res){
    //Get all campgrounds from DB
    Campground.find({},[],{sort:{
      date: 1 //Sort by Date Added DESC
  }}, function(err, campgrounds){
      if(err){
        console.log(err);
      } else {
        res.render("campgrounds/index", {campgrounds: campgrounds});
      }
    });
    
  });
  
  
  //NEW - Show form to create new campground
  router.get("/new", isLoggedIn, function(req, res){
    res.render("campgrounds/new");
  });
  
  //CREATE - Add new campground to DB
  router.post("/", isLoggedIn, function(req, res){
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    //relate author to campground
    var author = {
      id: req.user._id,
      username: req.user.username
    }
    var newCampground = {name: name, image: image, description: desc, author: author};
    //Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
      if(err){
        res.redirect("/campgrounds");
      } else {
         //redirect back to campgrounds page
         console.log(newlyCreated);
        res.redirect("/campgrounds");
      }
    });
  });
  
  // SHOW - Shows more inf o about the campground
  router.get("/:id", function(req, res){
    //Find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
      if(err){
        res.redirect("/campgrounds");
      } else {
      //render show template with that campground id
        res.render("campgrounds/show", {campground: foundCampground, moment: moment});
      }
    });
  });
  
//not found
router.get("*", function(req, res){
  res.redirect("/");
});

  function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect("/login");
  }

  module.exports = router;