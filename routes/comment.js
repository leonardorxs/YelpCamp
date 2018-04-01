const express = require("express"),
    router  = express.Router({mergeParams: true});

const Campground = require("../models/campground");
const Comment = require("../models/comment")

//SHOW COMMENT FORM
    router.get("/new", isLoggedIn, function(req, res){
    //find campground by id
    Campground.findById(req.params.id, function(err, campground){
      if(err){
        console.log(err);
      } else {
        res.render("comments/new", {campground: campground});
      }
    });
  });
  
//COMMENTS CREATE
  router.post("/", isLoggedIn, function(req, res){
    // lookup campgrounds using ID
    Campground.findById(req.params.id, function(err, campground){
      if(err){
        console.log(err);
        res.redirect("/campgrounds");
      } else {
        // create new comment
        Comment.create(req.body.comment, function(err, comment){
          if(err){
            console.log(err);
          } else {
            //add username and id to comment
            comment.author.id = req.user._id;
            comment.author.username = req.user.username;
            //save comment
            comment.save();
            // connect new comment to campground
            campground.comments.push(comment);
            campground.save();
            // redirect to campground showpage
            console.log(comment);
            res.redirect("/campgrounds/" + campground._id);
          }
        });
        
      }
    });
  });

  //not found
  router.get("*", function(req, res){
    res.redirect("/");
  });
  
  //MIDDLEWARE
  function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect("/login");
  }
  module.exports = router;