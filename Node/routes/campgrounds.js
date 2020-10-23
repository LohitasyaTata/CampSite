var express = require("express");
var router = express.Router();

var Campground = require("../models/campground");
var Comment = require("../models/comment");

//Campground Routes
router.get("/", function (req, res) {
	// get all campgrounds from db
	Campground.find({}, function (err, allCampgrounds) {
		if (err) {
			console.log("Error Noted");
			console.log(err);
		} else {
			console.log("Campgrounds Find Working Fine");
			res.render("campgrounds/index", {
				campgrounds: allCampgrounds,
				currentUser: req.user,
			});
		}
	});
	console.log("Campgrounds is Accessed");
});

// isLoggedIn, middleware

router.post("/", isLoggedIn, function (req, res) {
	//get data from form
	var name = req.body.name;
	var image = req.body.image;
	var subtitle = req.body.subtitle;
	var author = {
		id: req.user._id,
		username: req.user.username,
	};
	var newCampground = {
		name: name,
		image: image,
		subtitle: subtitle,
		author: author,
	};
	//Create new Campground and Save to Database

	Campground.create(newCampground, function (err, newlyCreated) {
		if (err) {
			console.log(err);
		} else {
			res.redirect("/campgrounds");
		}
	});
});

router.get("/:id/submit", isLoggedIn, function (req, res) {
	//find campground by id
	Campground.findById(req.params.id, function (err, campground) {
		if (err) {
			console.log(err);
		} else {
			res.render("comments/submit", {
				campground: campground,
				currentUser: req.user,
			});
		}
	});
});

// isLoggedIn removed

router.get("/new", isLoggedIn, function (req, res) {
	res.render("campgrounds/new.ejs", {
		currentUser: req.user,
	});
	console.log("Campgrounds/new is accessed");
});

// Show more info about particular campground
router.get("/:id", function (req, res) {
	//find the campground with the provided id and render and show template of that item
	console.log("This will be the show page one day");
	var id = req.params.id;
	Campground.findById(req.params.id)
		.populate("comments")
		.exec(function (err, foundCampground) {
			if (err) {
				console.log(
					"Error in the Route: /campgrounds/ " + foundCampground.name
				);
				console.log(err);
			} else {
				console.log(foundCampground + " Is Visited");
				console.log(id + "page is visted");
				res.render("campgrounds/show.ejs", {
					campground: foundCampground,
					currentUser: req.user,
				});
			}
		});
});

//Mehthod Override
//Edit Route
// router.get("/:id/edit", function (req, res) {
// 	Campground.findById(req.params.id, function (err, foundCampground) {
// 		if (err) {
// 			res.redirect("/campgrounds");
// 		} else {
// 			res.render("campgrounds/edit", { campground: foundCampground });
// 		}
// 	});
// });

router.put("/:id", function (req, res) {
	var data = req.body.campground;
	Campground.findByIdAndUpdate(req.params.body, data, function (
		err,
		updatedCampground
	) {
		if (err) {
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
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
