const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("../models/user");

exports.putSignup = async (req, res, next) => {
	// Evaluating possible errors collected through validation:
	const errors = validationResult(req);
	let error;
	if (!errors.isEmpty()) {
		error = new Error("Validation failed!");
		error.statusCode = 422;
		error.data = errors.array();
	}
	// Then extracting needed values we now have for signup
	const name = req.body.name;
	const email = req.body.email;
	const password = req.body.password;
	try {
		if (error) {
			// error has to be  thrown IN try! Otherwise app crashes
			throw error;
		}
		const hashedPw = await bcrypt.hash(password, 12);

		const user = new User({
			name: name,
			email: email,
			password: hashedPw,
		});
		const result = await user.save();

		res.status(201).json({
			message: "User was created!",
			userId: result._id,
		});
	} catch (err) {
		// Error here means: Network error or failing wth DB
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err); // Asynchronous code. Therefore forwarding err with next
	}
};

exports.postLogin = async (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	let loadedUser;
	try {
		const user = await User.findOne({ email: email });

		if (!user) {
			// Check if user with this email exists. If not, user is undefined!
			const error = new Error(
				"A user with this email could not be found!"
			);
			error.statusCode = 401; // 404 = User Not found; 401 = Not authentivated
			throw error;
		}
		loadedUser = user; // Storing user above to use it in other functions as well
		const isEqual = await bcrypt.compare(password, user.password); // Comparing pw the user entered with found pw on user object.Returns  Boolean

		if (!isEqual) {
			// Case false: Check if user entered a wrong password
			const error = new Error("Wrong password!");
			error.statusCode = 401; // 404 = User Not found; 401 = Not authenticated
			throw error;
		}
		// Here we know: User exists and credentials ar ok! Now we generate JWT
		const token = jwt.sign(
			{
				email: loadedUser.email,
				userId: loadedUser._id.toString(),
			},
			process.env.JWT_SECRET,
			{ expiresIn: "1h" }
		);
		res.status(200).json({
			token: token,
			userId: loadedUser._id.toString(),
			name: loadedUser.name,
		});
	} catch (err) {
		// Error here means: Network error or failing wth DB
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err); // Asynchronous code. Therefore forwarding err with next
	}
};

exports.getUserStatus = async (req, res, next) => {
	console.log(req);
	try {
		const user = await User.findById(req.userId);

		// console.log(user);
		if (!user) {
			const error = new Error("Not authenticated!");
			error.statusCode = 404;
			throw error;
		}
		res.status(200).json({
			status: user.status,
		});
	} catch (err) {
		// Error here means: Network error or failing wth DB
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err); // Asynchronous code. Therefore forwarding err with next
	}
};

exports.patchUpdateUserStatus = async (req, res, next) => {
	// Evaluating possible errors collected through validation:
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const error = new Error("Validation failed!");
		error.statusCode = 422;
		error.data = errors.array();
		throw error;
	}
	const newStatus = req.body.status; // Extracting new status:
	// console.log(req.body.status);
	try {
		const user = await User.findById(req.userId);

		if (!user) {
			const error = new Error("Not authenticated!");
			error.statusCode = 404;
			throw error;
		}
		user.status = newStatus; // Setting new status
		const result = await user.save();

		res.status(200).json({ message: "Status updated successfully!" });
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err); // Asynchronous code. Therefore forwarding err with next
	}
};
