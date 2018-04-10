const express = require("express"),
  router = express.Router();
const moment = require("moment");
moment.locale('pt-br');
const Campground = require("../models/campground");
const middleware = require("../middleware");

//INDEX - SHOW ALL CAMPGROUNDS
router.get("/", function (req, res) {
  //Get all campgrounds from DB
  Campground.find({ author: { $exists: true } }, [], {
    sort: {
      date: -1 //Sort by Date Added DESC
    }
  }, function (err, campgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", { campgrounds: campgrounds });
    }
  });

});


//NEW - Show form to create new campground
router.get("/new", middleware.isLoggedIn, function (req, res) {
  res.render("campgrounds/new");
});

//CREATE - Add new campground to DB
router.post("/", middleware.isLoggedIn, function (req, res) {
  //get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var price = req.body.price;
  var desc = req.body.description;
  //relate author to campground
  var author = {
    id: req.user._id,
    username: req.user.username
  }
  var newCampground = { name: name, image: image, price: price, description: desc, author: author };
  //Create a new campground and save to DB
  Campground.create(newCampground, function (err, newlyCreated) {
    if (err) {
      console.log(err);
      req.flash("error", err.message);
      res.redirect("back");
    } else {
      //redirect back to campgrounds page
      res.redirect("/campgrounds");
    }
  });
});

// SHOW - Shows more inf o about the campground
router.get("/:id", function (req, res) {
  //Find the campground with provided ID
  Campground.findById(req.params.id).populate({path: 'comments', options: { sort: { 'date': -1 } } }).exec(function (err, foundCampground) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      //render show template with that campground id
      res.render("campgrounds/show", {   campground: foundCampground, moment: moment });
    }
  });
});

// //EDIT ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
          res.render("campgrounds/edit", { campground: foundCampground });
    });
});

// //UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function (req, res) {
  //find and update the correct campground
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampground) {
    if (err) {
      req.flash("error", err.message);
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds/" + updatedCampground._id);
    }
  });
});

//DESTROY ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function (req, res) {
  //DESTROY BLOG
  Campground.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      req.flash("error", err.message);
      res.redirect("back");
    } else {
      res.redirect("/campgrounds");
    }
  });
});


// not found
router.get("*", function (req, res) {
  res.redirect("/");
});

module.exports = router;