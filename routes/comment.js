const express = require("express"),
  router = express.Router({ mergeParams: true });

const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware");

//SHOW COMMENT FORM
router.get("/new", middleware.isLoggedIn, function (req, res) {
  //find campground by id
  Campground.findById(req.params.id, function (err, campground) {
    if (err) {
      console.log(err);
      req.flash("error", "Um erro ocorreu...");
      res.redirect("/campgrounds");
    } else {
      res.render("comments/new", { campground: campground });
    }
  });
});

//COMMENTS CREATE
router.post("/", middleware.isLoggedIn, function (req, res) {
  // lookup campgrounds using ID
  Campground.findById(req.params.id, function (err, campground) {
    if (err) {
      console.log(err);
      req.flash("error", "Não foi possível finalizar a operação...");
      res.redirect("/campgrounds");
    } else {
      // create new comment
      Comment.create(req.body.comment, function (err, comment) {
        if (err) {
          console.log(err);
          req.flash("error", "Não foi possível finalizar a operação...");
          res.redirect("back");
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
          res.redirect("/campgrounds/" + campground._id + "/#commentsSection");
        }
      });

    }
  });
});

//EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function (req, res) {
  Comment.findById(req.params.comment_id, function(err, foundComment){
    if(err){
      req
      res.redirect("back");
    } else {
      res.render("comments/edit", {campground_id : req.params.id, comment: foundComment});
    }
  });
});

//UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
    if(err){
      req.flash("error", "Não foi possível finalizar a operação...");
      res.redirect("back");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

//COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
  //findByIdAndRemove
  Comment.findByIdAndRemove(req.params.comment_id, function(err){
    if(err){
      res.redirect("back");
    } else {
      res.redirect("back");
    }
  });
});

module.exports = router;