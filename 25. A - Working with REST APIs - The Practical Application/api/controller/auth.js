const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const User = require("../models/user");

exports.putSignup = (req, res, next) => {
	// Evaluating possible errors collected through validation:
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const error = new Error("Validation failed!");
		error.statusCode = 422;
		error.data = errors.array();
		throw error;
	}
	// Then extracting needed values we now have for signup
	const name = req.body.name;
	const email = req.body.email;
	const password = req.body.password;
	bcrypt
		.hash(password, 12)
		.then((hashedPw) => {
			const user = new User({
				name: name,
				email: email,
				password: hashedPw,
			});
			return user.save();
		})
		.then((result) => {
			res.status(201).json({
				message: "User was created!",
				userId: result._id,
			});
		})
		.catch((err) => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err); // Asynchronous code. Therefore forwarding err with next
		});
};
