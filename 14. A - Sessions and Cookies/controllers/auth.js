const User = require("../models/user");

// Getting and displaying them on Login Page
exports.getLogin = (req, res, next) => {
	res.render("auth/login", {
		pageTitle: "Login",
		path: "/login",
		isAuthenticated: req.session.isLoggedIn,
	});
};

// Handling post login request
exports.postLogin = (req, res, next) => {
	User.findById("643579d57d06c46ba7a0313d")
		.then((user) => {
			req.session.isLoggedIn = true;
			req.session.user = user;
			res.redirect("/");
		})
		.catch((err) => {
			console.log(err);
		});
};

// Handling post logout request
exports.postLogout = (req, res, next) => {
	req.session.destroy((err) => {
		console.log(err);
		res.redirect("/");
	});
};
