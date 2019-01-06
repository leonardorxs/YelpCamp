const express  = require("express"),
  app        = express(),
  bodyParser = require("body-parser"),
  mongoose   = require("mongoose"),
  flash      = require("connect-flash");
  passport   = require("passport"),
  methodOverride = require("method-override"),
  LocalStrategy = require("passport-local"),
  FacebookStrategy = require("passport-facebook"),
  Campground = require("./models/campground"),
  Comment    = require("./models/comment"),
  User       = require("./models/user"),
  seedDB     = require("./seeds");
  
const FACEBOOK_APP_ID = 'process.env.YELPCAMP_FACEBOOKID',
  FACEBOOK_APP_SECRET = 'process.env.YELPCAMP_FACEBOOKPASSWORD';
//requiring routes
const campgroundRoutes = require("./routes/campground")
    commentRoutes    = require("./routes/comment"),
    indexRoutes      = require("./routes/index");

    var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp";
mongoose.connect(url);
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); //seed database

//PASSPORT CONFIGURATION
app.use(require("express-session")({
  secret: "Criado por Leonardorxs",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.use(new FacebookStrategy({
  clientID: FACEBOOK_APP_ID,
  clientSecret: FACEBOOK_APP_SECRET,
  callbackURL: "https://calm-harbor-29946.herokuapp.com/auth/facebook/callback"
},
function(accessToken, refreshToken, profile, done) {
  console.log(accessToken, refreshToken, profile, done);
  User.findOrCreate(profile, function(err, user) {
    if (err) { return done(err); }
    done(null, user);
  });
}
));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.alertMessage = {};
  res.locals.alertMessage.error = req.flash("error");
  res.locals.alertMessage.success = req.flash("success");
  res.locals.alertMessage.warning = req.flash("warning");
  next();
});
app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);
//not found
app.get("/*", function(req, res){
  res.redirect("/");
});

// ================ START SERVER ===============
app.listen(process.env.PORT || 3000, function(){
  console.log("The YelpCamp Server has started!");
});
