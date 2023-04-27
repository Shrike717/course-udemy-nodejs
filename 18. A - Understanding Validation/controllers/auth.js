const crypto = require("crypto");
const { validationResult } = require("express-validator");

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

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log(errors.array());
		return res.status(422).render("auth/signup", {
			path: "/signup",
			pageTitle: "Signup",
			errorMessage: errors.array()[0].msg,
		});
	}
	bcrypt
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
		User.findOne({ email: req.body.email })
			.then((user) => {
				if (!user) {
					req.flash("error", "No account with that email found!");
					return res.redirect("/reset");
				}
				user.resetToken = token; // Setting token to user object
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
                        <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password<p>
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

// Getting and displaying the New Password Page after click on link in email
exports.getNewPassword = (req, res, next) => {
	const token = req.params.token;
	User.findOne({
		resetToken: token,
		resetTokenExpiration: { $gt: Date.now() },
	})
		.then((user) => {
			let message = req.flash("error");
			if (message.length > 0) {
				message = message[0];
			} else {
				message = null;
			}
			res.render("auth/new-password", {
				path: "/new-password",
				pageTitle: "New Password",
				errorMessage: message,
				userId: user._id.toString(),
				passwordToken: token,
			});
		})
		.catch((err) => {
			console.log(err);
		});
};

// Setting new password for user after click on Update Password Button
exports.postNewPassword = (req, res, next) => {
	const newPassword = req.body.password;
	const userId = req.body.userId;
	const passwordToken = req.body.passwordToken;
	let resetUser;

	User.findOne({
		resetToken: passwordToken,
		resetTokenExpiration: { $gt: Date.now() }, // Token date must be greater then actual date
		_id: userId,
	})
		.then((user) => {
			console.log(user);
			resetUser = user;
			return bcrypt.hashSync(newPassword, 12); // Encrypting new password
		})
		.then((hashedPassword) => {
			resetUser.password = hashedPassword;
			resetUser.resetToken = undefined; // Setting token back to undefined
			resetUser.resetTokenExpiration = undefined; // Setting expiration back to undefined
			return resetUser.save();
		})
		.then((result) => {
			res.redirect("/login");
		})
		.catch((err) => {
			console.log(err);
		});
};
