const User = require("../models/user");

// Getting and displaying them on Login Page
exports.getLogin = (req, res, next) => {
	res.render("auth/login", {
		pageTitle: "Login",
		path: "/login",
		isAuthenticated: req.session.isLoggedIn,
	});
};

exports.getSignup = (req, res, next) => {
	res.render("auth/signup", {
		path: "/signup",
		pageTitle: "Signup",
		isAuthenticated: false,
	});
};

// Handling post login request
exports.postLogin = (req, res, next) => {
	User.findById("643579d57d06c46ba7a0313d")
		.then((user) => {
			req.session.isLoggedIn = true;
			req.session.user = user;
			req.session.save((err) => {
				console.log(err);
				res.redirect("/");
			});
		})
		.catch((err) => {
			console.log(err);
		});
};

// Handles Signup and checks if email already exists.
// If yes, redirects to signup page again
// If no, creates new user with credenials and redirects to login page
exports.postSignup = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	const confirmPassword = req.body.confirmPassword;
	User.findOne({ email: email })
		.then((userDoc) => {
			if (userDoc) {
				return res.redirect("/signup");
			}
			const user = new User({
				email: email,
				password: password,
				cart: { iems: [] },
			});
			return user.save();
		})
		.then((result) => {
			res.redirect("/login");
		})
		.catch((err) => {
			console.log(err);
		});
};

// Handling post logout request
exports.postLogout = (req, res, next) => {
	req.session.destroy((err) => {
		// Deletes session in DB
		console.log(err);
		res.redirect("/");
	});
};
