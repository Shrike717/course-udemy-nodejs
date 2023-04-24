const crypto = require("crypto");

const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("../models/user");

const sgMail = require("@sendgrid/mail");
const { CLIENT_RENEG_LIMIT } = require("tls");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Getting and displaying them on Login Page
exports.getLogin = (req, res, next) => {
	let message = req.flash("error");
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	res.render("auth/login", {
		path: "/login",
		pageTitle: "Login",
		errorMessage: message,
	});
};

exports.getSignup = (req, res, next) => {
	let message = req.flash("error");
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	res.render("auth/signup", {
		path: "/signup",
		pageTitle: "Signup",
		errorMessage: message,
	});
};

// Handling post login request
exports.postLogin = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	User.findOne({ email: email })
		.then((user) => {
			if (!user) {
				req.flash("error", "Invalid email or passsword!");
				return res.redirect("/login");
			}
			bcrypt
				.compare(password, user.password)
				.then((doMatch) => {
					if (doMatch) {
						req.session.isLoggedIn = true;
						req.session.user = user;
						return req.session.save((err) => {
							console.log(err);
							res.redirect("/");
						});
					}
					req.flash("error", "Invalid email or passsword!");
					res.redirect("/login");
				})
				.catch((err) => {
					console.log(err);
					res.redirect("/login");
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
				req.flash("error", "E-mail already exists!");
				return res.redirect("/signup");
			}
			return bcrypt
				.hash(password, 12)
				.then((hashedPassword) => {
					const user = new User({
						email: email,
						password: hashedPassword,
						cart: { items: [] },
					});
					return user.save();
				})
				.then((result) => {
					res.redirect("/login");
					// Configurating Message and calling the send function on sgMail object with message afterwards
					const msg = {
						to: email, // Change to your recipient -> dan717@gmx.de
						from: "dbauer.webdev@gmail.com", // Change to your verified sender
						subject: "Signup succeeded!",
						text: "You successfully signed up!",
						html: "<strong>You successfully signed up!</strong>",
					};
					sgMail
						.send(msg)
						.then((response) => {
							console.log(response[0].statusCode);
							console.log(response[0].headers);
						})
						.catch((error) => {
							console.error(error);
						});
				});
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

// Getting and displaying the Reset Page
exports.getReset = (req, res, next) => {
	let message = req.flash("error");
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	res.render("auth/reset", {
		path: "/reset",
		pageTitle: "Reset Password",
		errorMessage: message,
	});
};

// When button Reset Password is clicked
exports.postReset = (req, res, next) => {
    // First creating security token with build in module crypto
	crypto.randomBytes(32, (err, buffer) => {
		if (err) {
			console.log(err);
			return res.redirect("/reset");
		}
		const token = buffer.toString("hex"); // Needs hex to be converted to ASCII
		User.findOne({ emeil: req.body.email })
			.then((user) => {
				if (!user) {
					req.flash("error", "No account with that email found!");
					return redirect("/reset");
				}
				user.resetToken = token; // Ssetting token to user object
				user.resetTokenExpiration = Date.now() + 3600000; // Setting date + 1 hour
				return user.save();
			})
			.then((result) => {
				res.redirect("/");
				const msg = {
					to: req.body.email, // Extracting email from reset form -> dan717@gmx.de
					from: "dbauer.webdev@gmail.com", // Change to your verified sender -> our shop
					subject: "Password reset",
					text: "You successfully signed up!",
					html: `
                        <p>You requested a passsword reset<p>
                        <p>Click this <a href="http://localhost:3000/${token}">link</a> to set a new password<p>
                    `,
				};
				sgMail
					.send(msg)
					.then((response) => {
						console.log(response[0].statusCode);
						console.log(response[0].headers);
					})
					.catch((error) => {
						console.error(error);
					});
			})
			.catch((err) => {
				console.log(err);
			});
	});
};
