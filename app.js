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
  
//requiring routes
var campgroundRoutes = require("./routes/campground")
    commentRoutes    = require("./routes/comment"),
    indexRoutes      = require("./routes/index");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// seedDB(); //seed database 

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
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next();
});
app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

app.get("/*", function(req, res){
  res.redirect("/");
});

// ================ START SERVER ===============
app.listen(process.env.PORT || 3000, function(){
  console.log("The YelpCamp Server has started!");
});