const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("../models/user");
const Post = require("../models/post");

// A resolver gives back the data. Like controller in REST
module.exports = {
	createUser: async function ({ userInput }, req) {
		// const email = args.userInput.email;

		// Validation:
		const errors = [];
		if (!validator.isEmail(userInput.email)) {
			errors.push({ message: "Invalid email!" });
		}
		if (
			validator.isEmpty(userInput.password) ||
			!validator.isLength(userInput.password, { min: 5 })
		) {
			errors.push({ message: "Invalid password!" });
		}
		if (errors.length > 0) {
			const error = new Error("Invalid input!");
			error.data = errors;
			error.code = 422;
			throw error;
		}

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

		// Then we have to return what was defined n our mutation in the schema: The user object
		return { ...createdUser._doc, _id: createdUser._id.toString() }; // Returning only user data with _doc. And converting _id to string
	},

	login: async function ({ email, password }) {
		// First find  the user. Email in DB should match incoming email
		const user = await User.findOne({ email: email });
		// If there is no user:
		if (!user) {
			const error = new Error("Could not find user!");
			error.code = 401; // User could not authenticate
			throw error;
		}
		// If we pass to here we have a user. Now checking password. Incomingg pw vs pw from DB
		const isEqual = await bcrypt.compare(password, user.password);
		// If its not equal user entered wrong pw:
		if (!isEqual) {
			const error = new Error("Wrong password!");
			error.code = 401; // User could not authenticate
			throw error;
		}
		// If we pass to here we have correct credentials. Now creating token:
		// 1. arg: What is included. 2. arg: Secret. 3. arg: Expiration period
		const token = jwt.sign(
			{
				userId: user._id.toString(),
				email: user.email,
			},
			process.env.JWT_SECRET,
			{ expiresIn: "1h" }
		);
		// Now we have to return what was needed in the login query in the schema in AuthData:
		return { token: token, userId: user._id.toString() };
	},

	createPost: async function ({ postInput }, req) {
		// Checking if user is authenticated:
		if (!req.isAuth) {
			const error = new Error("User is not authenticated.");
			error.code = 401;
			throw error;
		}

		// Validation:
		const errors = [];
		// Checking title:
		if (
			validator.isEmpty(postInput.title) ||
			!validator.isLength(postInput.title, { min: 5 })
		) {
			errors.push("Title is invalid.");
		}
		// Checking content:
		if (
			validator.isEmpty(postInput.content) ||
			!validator.isLength(postInput.content, { min: 5 })
		) {
			errors.push("Content is invalid.");
		}
		if (errors.length > 0) {
			const error = new Error("Invalid input!");
			error.data = errors;
			error.code = 422;
			throw error;
		}

		// Getting authenticated user from DB:
		const user = await User.findById(req.userId);
		// Check if there is a user:
		if (!user) {
			const error = new Error("No user found!");
			error.code = 401;
			throw error;
		}

		// Now we have valid data and can create a post:
		const post = new Post({
			title: postInput.title,
			content: postInput.content,
			imageUrl: postInput.imageUrl,
			creator: user,
		});
		const createdPost = await post.save();
		// Add post to users posts array
		user.posts.push(createdPost);
		await user.save();

		return {
			...createdPost._doc,
			_id: createdPost._id.toString(), // Has to be string not MG Objct Id
			createdAt: createdPost.createdAt.toISOString(), // GQ can't read date. Therefore has to be string
			updatedAt: createdPost.updatedAt.toISOString(),
		};
	},
};
