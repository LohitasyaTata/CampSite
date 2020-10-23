var express = require("express");
var router = express.Router();

var passport = require("passport");
var User = require("../models/user");

var Campground = require("../models/campground");
var Comment = require("../models/comment");

// Routes
router.get("/", function (req, res) {
	res.render("landing", {
		currentUser: req.user,
	});
	console.log("root page is accessed");
});

//Auth Routes

//show register form
router.get("/register", function (req, res) {
	res.render("register", {
		currentUser: req.user,
	});
});

//Sign Up logic
router.post("/register", function (req, res) {
	var newUser = new User({ username: req.body.username });
	User.register(newUser, req.body.password, function (err, user) {
		if (err) {
			console.log(err);
			return res.render("register", {
				currentUser: req.user,
			});
		} else {
			passport.authenticate("local")(req, res, function () {
				res.redirect("/login");
			});
		}
	}); 
});

//Login Routes
router.get("/login", function (req, res) {
	res.render("login", {
		currentUser: req.user,
	});
});

router.post(
	"/login",
	passport.authenticate("local", {
		successRedirect: "/campgrounds",
		failureRedirect: "/login",
	}),
	function (req, res) {}
);

//Logout Route
router.get("/logout", function (req, res) {
	req.logout();
	res.redirect("/");
});

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		res.redirect("/login");
	}
}

module.exports = router;
