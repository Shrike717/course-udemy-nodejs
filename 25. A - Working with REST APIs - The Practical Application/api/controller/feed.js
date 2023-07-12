const fs = require("fs");
const path = require("path");

const mongoose = require("mongoose");
const { validationResult } = require("express-validator");

const io = require("../socket");
const Post = require("../models/post");
const User = require("../models/user");

// Since Node 14.3 would be possible to use await on top level OUUTSIDE of a async await function

exports.getPosts = async (req, res, next) => {
	// async in front of function with async code
	const currentPage = req.query.page || 1; // Extracting current page coming from FE
	const perPage = 2; // Hardcoded. Same as in FE
	let totalItems; // Determins how many items are in the DB
	try {
		totalItems = await Post.find() // Saving result with await directly in variable
			.countDocuments(); // First counting all posts

		const posts = await Post.find() // And then loading it
			.populate("creator") // Adding the creator field (User Id) with populate to get user name from user object
			.sort({ createdAt: -1 }) // Sorts posts in descending order
			.skip((currentPage - 1) * perPage) // Skips items from previous page when loading
			.limit(perPage); // And limits the amount of loaded itmes

		res.status(200).json({
			// Sending response with json() method
			message: "Posts loaded successfully!",
			posts: posts,
			totalItems: totalItems,
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err); // Asynchronous code. Therefore forwarding err with next
	}
};

exports.createPost = async (req, res, next) => {
	// Errors the validator package might have gathered
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const error = new Error(
			"Validation failed! Entered data is incorrect."
		);
		error.statusCode = 422;
		throw error; // Synchronous code therefor throw
	}
	// Checking if incoming request has a file:
	if (!req.file) {
		const error = new Error("No image provided!");
		error.statusCode = 422; // This is also a validation error
		throw error;
	}
	// If there is a file imageUrl is extracted:
	const imageUrl = req.file.path;

	// Extracting payload from body
	const title = req.body.title;
	const content = req.body.content;

	// Create post in db
	const post = new Post({
		title: title,
		imageUrl: imageUrl,
		content: content,
		creator: req.userId, // This userId was set to request in is-auth Middleware
	});
	// It has to be saved to DB.
	try {
		await post.save();
		// console.log(result);
		const user = await User.findById(req.userId); // We have to get actual user from DB

		user.posts.push(post); // To push the post to the posts array in user object. Mongoose extracts only the needed postId
		await user.save(); // Saving user after updating it

		// Now informing all other users about this new post. emit = to all clients, broadcast: to all clients exept creator
		io.getIo().emit("posts", {
			action: "create",
			post: {
				...post._doc,
				creator: { _id: req.userId, name: user.name },
			},
		});

		res.status(201).json({
			// Sending response with json() method
			message: "Post created successfully!",
			post: post, // Sending back new post object created above
			creator: { _id: user._id, name: user.name }, // And user id and name
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err); // Asynchronous code. Therefore forwarding err with next
	}
};

// Gets one single post:
exports.getPost = async (req, res, next) => {
	const postId = req.params.postId;
	try {
		const post = await Post.findById(postId);
		if (!post) {
			const error = new Error("No such post found!");
			error.statusCode = 404; // Sth. was not found therefore 404
			throw error; // CAUTION: Despite this being async code in .then we throw the error. It gets passed to the following catch and is forwarded with  next
		}
		res.status(200).json({
			message: "Post loaded successfully!",
			post: post, // result is the post coming back from the DB
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err); // Asynchronous code. Therefore forwarding err with next
	}
};

// Edits a post:
exports.updatePost = async (req, res, next) => {
	const postId = req.params.postId; // Extracting postId from URL
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const error = new Error(
			"Validation failed! Entered data is incorrect."
		);
		error.statusCode = 422;
		throw error; // Synchronous code therefor throw
	}
	// Extracting the content i want to update:
	const title = req.body.title;
	const content = req.body.content;
	// Has 2 options
	let imageUrl = req.body.image; // 1. imageUrl is part of incoming request as text. No new image file was added.
	if (req.file) {
		// 2. New file  was picked. req.file is set through multer
		imageUrl = req.file.path; // New imageUrl
	}
	if (!imageUrl) {
		// If imageUrl is still undefined throw error
		const error = new Error("No file picked!");
		res.statusCode = 422;
		throw error;
	}
	// If i reach this point i have valid data and now i can update post in DB:
	try {
		const post = await Post.findById(postId).populate("creator"); // Populate takes cr.id, reach out to user collection and fetches all data from user

		if (!post) {
			const error = new Error("No such post found!");
			error.statusCode = 404; // Sth. was not found therefore 404
			throw error; // CAUTION: Despite this being async code in .then we throw the error. It gets passed to the following catch and is forwarded with  next
		}
		// Checking if post is equal to owner by user comparing the user ids:
		if (post.creator._id.toString() !== req.userId) {
			const error = new Error("Not authorized!");
			error.statusCode = 403; // Forbidden. Access to ressource blocked
			throw error;
		}
		// Checking if there was a new image to then delete the old image:
		if (imageUrl !== post.imageUrl) {
			// Passing the old imageUrl
			clearImage(post.imageUrl);
		}
		// Setting post properties to the exracted updated values.
		post.title = title;
		post.imageUrl = imageUrl;
		post.content = content;
		// And saving it back to the DB. Overwriting old post but keeping old Id::
		const result = await post.save();

		// Then getting back result of the above operation

		// Also update posts with websocket to all connected clients:
		io.getIo().emit("posts", { action: "update", post: result });

		// Returning successs messsage and updated post from DB
		res.status(200).json({
			message: "Post updated succssfully!",
			post: result,
		});
	} catch (err) {
		console.log(err);
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err); // Asynchronous code. Therefore forwarding err with next
	}
};

// Deleting a post:
exports.deletePost = async (req, res, next) => {
	const postId = req.params.postId;
	try {
		const post = await Post.findById(postId);
		if (!post) {
			const error = new Error("No such post found!");
			error.statusCode = 404; // Sth. was not found therefore 404
			throw error; // CAUTION: Despite this being async code in .then we throw the error. It gets passed to the following catch and is forwarded with  next
		}
		// Checking if post is equal to owner by user comparing the user ids:
		if (post.creator.toString() !== req.userId) {
			const error = new Error("Not authorized!");
			error.statusCode = 403; // Forbidden. Access to ressource blocked
			throw error;
		}

		clearImage(post.imageUrl);

		await Post.findByIdAndDelete(postId);

		// console.log(result);
		const user = await User.findById(req.userId); // Finding owner to clear postId from user object
		user.posts.pull(postId); // Deleting the postId
		await user.save();

		res.status(200).json({
			message: "Post successfully deleted!",
		});
	} catch (err) {
		console.log(err);
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err); // Asynchronous code. Therefore forwarding err with next
	}
};

// Helper function to delete old mage when post was pdated with a new image:
const clearImage = (filePath) => {
	// First constructing filePath to old image:
	filePath = path.join(__dirname, "..", filePath);
	// Then deleting old image:
	fs.unlink(filePath, (err) => console.log(err));
};
