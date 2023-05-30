const { validationResult } = require("express-validator");

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
};
