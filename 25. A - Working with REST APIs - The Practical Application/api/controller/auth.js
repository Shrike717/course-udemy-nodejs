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
		.catch((err) => { // Error here means: Network error or failing wth DB
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err); // Asynchronous code. Therefore forwarding err with next
		});
};

exports.postLogin = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
    let loadedUser;
	User.findOne({email: email})
		.then(user => {
            if (!user) { // Check if user with this email exists. If not, user is undefined!
                const error = new Error("A user with this email could not be found!")
                error.statusCode = 401; // 404 = User Not found; 401 = Not authentivated
                throw error;
            }
            loadedUser = user; // Storing user above to use it in other functions as well
            return bcrypt.compare(password, user.password); // Comparing pw the user entered with found pw on user object.Returns  Boolean
        })
        .then(isEqual => {
            if (!isEqual) { // Case false: Check if user entered a wrong password
                const error = new Error("Wrong password!")
                error.statusCode = 401; // 404 = User Not found; 401 = Not authenticated
                throw error;
            }
            // Here we know: User exists and password is ok! Now we generate JWT
        })
		.catch((err) => { // Error here means: Network error or failing wth DB
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err); // Asynchronous code. Therefore forwarding err with next
		});
};
