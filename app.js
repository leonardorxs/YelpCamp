var express  = require("express"),
  app        = express(),
  bodyParser = require("body-parser"),
  mongoose   = require("mongoose"),
  passport   = require("passport"),
  LocalStrategy = require("passport-local"),
  Campground = require("./models/campground"),
  Comment    = require("./models/comment"),
  User       = require("./models/user"),
  seedDB     = require("./seeds");
  

mongoose.connect("mongodb://localhost/yelp_camp_v6");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

//PASSPORT CONFIGURATION
app.use(require("express-session")({
  secret: "YelpCamp is dope",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function(req, res){
  res.render("landing");
});

app.get("/campgrounds", function(req, res){
  //Get all campgrounds from DB
  Campground.find({}, function(err, allCampgrounds){
    if(err){
      console.log(err);
    } else {
      res.render("campgrounds/index", {campgrounds: allCampgrounds});
    }
  });
  
});


//NEW - Show form to create new campground
app.get("/campgrounds/new", function(req, res){
  res.render("campgrounds/new");
});

//CREATE - Add new campground to DB
app.post("/campgrounds", function(req, res){
  //get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var newCampground = {name: name, image: image, description: desc};
  //Create a new campground and save to DB
  Campground.create(newCampground, function(err, newlyCreated){
    if(err){
      console.log(err);
    } else {
       //redirect back to campgrounds page
      res.redirect("/campgrounds");
    }
  });
});

// SHOW - Shows more inf o about the campground
app.get("/campgrounds/:id", function(req, res){
  //Find the campground with provided ID
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
    if(err){
      console.log(err);
    } else {
    //render show template with that campground id
      res.render("campgrounds/show", {campground: foundCampground});
    }
  });
});

//=============================================================================
//COMMENTS ROUTES
//=============================================================================

app.get("/campgrounds/:id/comments/new", function(req, res){
  //find campground by id
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log(err);
    } else {
      res.render("comments/new", {campground: campground});
    }
  });
});

app.post("/campgrounds/:id/comments", function(req, res){
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
          // connect new comment to campground
          campground.comments.push(comment);
          campground.save();
          // redirect to campground showpage
          res.redirect("/campgrounds/" + campground._id);
        }
      });
      
    }
  });
});

// ==================== AUTH ROUTES ===============================
//show register form
app.get("/register",function(req,res){
  res.render("register");
});
//handle signup logic
app.post("/register", function(req, res) {
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
app.get("/login", function(req, res) {
  res.render("login"); 
});
//handle login logic // passport.authenticate is a callback that takes care of everything 
app.post("/login", passport.authenticate("local", 
  {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
  }));

//logout
app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/campgrounds");
});



//NOTFOUND
app.get("*", function(req, res) {
  res.redirect("/"); 
});

// ================ START SERVER ===============
app.listen(process.env.PORT || 3000, function(){
  console.log("The YelpCamp Server has started!");
});