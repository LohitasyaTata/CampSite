var express = require("express");
var router = express.Router();

var Campground = require("../models/campground");
var Comment = require("../models/comment");

router.get("/campgrounds/:id/comments/new", isLoggedIn, function (req, res) {
	//find campground by id
	Campground.findById(req.params.id, function (err, campground) {
		if (err) {
			console.log(err);
		} else {
			res.render("comments/new", {
				campground: campground,
				currentUser: req.user,
			});
		}
	});
});

router.post("/campgrounds/:id/comments", isLoggedIn, function (req, res) {
	//Lookup campground from id
	Campground.findById(req.params.id, function (err, campground) {
		if (err) {
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			Comment.create(req.body.comment, function (err, comment) {
				if (err) {
					console.log(err);
				} else {
					//add Username and Id to Comments
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//Save Comment
					comment.save();
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
});

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		res.redirect("/login");
	}
}

module.exports = router;
