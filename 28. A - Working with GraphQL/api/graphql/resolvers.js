const bcrypt = require("bcryptjs");

const User = require("../models/user");

// A resolver gives back the data. Like controller in REST
module.exports = {
	createUser: async function ({ userInput }, req) {
		// const email = args.userInput.email;

		// First we check if user already exists. Is there a email already matching the one ccoming in?
		const existingUser = await User.findOne({ email: userInput.email });
		// If user already exists:
		if (existingUser) {
			const error = new Error("User already exists!");
			throw error;
		}
		// If user can be created, first hash pw with 12 salting rounds:
		const hashedPw = await bcrypt.hash(userInput.password, 12);

		// Now creating new user objeect:
		const user = new User({
			email: userInput.email,
			name: userInput.name,
			password: hashedPw,
		});

		// And save it to DB:
		const createdUser = await user.save();

		// Then we have to reeturn what was defined n our mutation in the schema: The user object
		return { ...createdUser._doc, _id: createdUser._id.toString() }; // Returning only user data with _doc. And converting _id to string
	},
};
