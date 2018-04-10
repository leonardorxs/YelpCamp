//all the middleware goes here
var middlewareObj = {};
const Campground = require("../models/campground");
const Comment = require("../models/comment");

middlewareObj.checkCampgroundOwnership = function (req, res, next) {
	if (req.isAuthenticated()) {
		Campground.findById(req.params.id, function (err, foundCampground) {
			if (err) {
				res.redirect("back");
			} else {
				//does user own the campground
				if (foundCampground.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash("error", "Você não é o autor dessa postagem...");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "Você precisa estar logado...");
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = function (req, res, next) {
	if (req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, function (err, foundComment) {
			if (err) {
				res.redirect("back");
			} else {
				//does user own the comment
				if (foundComment.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash("error", "Você não é o autor deste comentário...");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "Você precisa estar logado...");
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn = function (req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	req.flash("error", "Você precisa estar logado!");
	res.redirect("/login");
}

middlewareObj.isLoggedOut = function(req, res, next){
	if(!req.isAuthenticated()){
		return next();
	}
	req.flash("error", "Um erro ocorreu...");
	res.redirect("/");
}

module.exports = middlewareObj;