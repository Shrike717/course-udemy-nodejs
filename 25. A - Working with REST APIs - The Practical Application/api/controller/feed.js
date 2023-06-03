const fs = require("fs");
const path = require("path");

const mongoose = require("mongoose");
const { validationResult } = require("express-validator");

const Post = require("../models/post");
const User = require("../models/user");

exports.getPosts = (req, res, next) => {
	const currentPage = req.query.page || 1; // Extracting current page coming from FE
	const perPage = 2; // Hardcoded. Same as in FE
	let totalItems; // Determins how many items are in the DB
	Post.find()
		.countDocuments() // First counting all posts
		.then((count) => {
			totalItems = count;
			return Post.find() // And then loading it
				.skip((currentPage - 1) * perPage) // Skips items from previous page when loading
				.limit(perPage); // And limits the amount of loaded itmes
		})
		.then((posts) => {
			res.status(200).json({
				// Sending response with json() method
				message: "Posts loaded successfully!",
				posts: posts,
				totalItems: totalItems,
			});
		})
		.catch((err) => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err); // Asynchronous code. Therefore forwarding err with next
		});
};

exports.createPost = (req, res, next) => {
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
	let creator;

	// Create post in db
	const post = new Post({
		title: title,
		imageUrl: imageUrl,
		content: content,
		creator: req.userId, // This userId was set to request in is-auth Middleware
	});
	// It has to be saved to DB. Gives back promise like object:
	post.save()
		.then((result) => {
			// console.log(result);
			return User.findById(req.userId); // We have to get actual user from DB
		})
		.then((user) => {
			creator = user;
			user.posts.push(post); // To push the post to the posts array. Mongoose extracts only the needed postId
			return user.save(); // Saving user after updating it
		})
		.then((result) => {
			res.status(201).json({
				// Sending response with json() method
				message: "Post created successfully!",
				post: post, // Sending back new post object created above
				creator: { _id: creator._id, name: creator.name }, // And creator id and name
			});
		})
		.catch((err) => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err); // Asynchronous code. Therefore forwarding err with next
		});
};

// Gets one single post:
exports.getPost = (req, res, next) => {
	const postId = req.params.postId;
	Post.findById(postId)
		.then((post) => {
			if (!post) {
				const error = new Error("No such post found!");
				error.statusCode = 404; // Sth. was not found therefore 404
				throw error; // CAUTION: Despite this being async code in .then we throw the error. It gets passed to the following catch and is forwarded with  next
			}
			res.status(200).json({
				message: "Post loaded successfully!",
				post: post, // result is the post coming back from the DB
			});
		})
		.catch((err) => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err); // Asynchronous code. Therefore forwarding err with next
		});
};

// Edits a post:
exports.updatePost = (req, res, next) => {
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
	Post.findById(postId)
		.then((post) => {
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
			// Checking if there was a new image to then delete the  old image:
			if (imageUrl !== post.imageUrl) {
				// Passing the old imageUrl
				clearImage(post.imageUrl);
			}
			// Setting post properties to the exracted updated values.
			post.title = title;
			post.imageUrl = imageUrl;
			post.content = content;
			// And saving it back to the DB. Overwriting old post but keeping old Id::
			return post.save();
		})
		// Then getting back result of the above operation
		.then((result) => {
			// Returning successs messsage and updated post from DB
			res.status(200).json({
				message: "Post updated succssfully!",
				post: result,
			});
		})
		.catch((err) => {
			console.log(err);
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err); // Asynchronous code. Therefore forwarding err with next
		});
};

// Deleting a post:
exports.deletePost = (req, res, next) => {
	const postId = req.params.postId;
	Post.findById(postId)
		.then((post) => {
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

			return Post.findByIdAndDelete(postId);
		})
		.then((result) => {
			// console.log(result);
			return User.findById(req.userId);  // Finding owner to clear postId from user object
		})
		.then((user) => {
			user.posts.pull(postId); // Deleting the postId
			return user.save();
		})
		.then((result) => {
			res.status(200).json({
				message: "Post successfully deleted!",
			});
		})
		.catch((err) => {
			console.log(err);
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err); // Asynchronous code. Therefore forwarding err with next
		});
};

// Helper function to delete old mage when post was pdated with a new image:
const clearImage = (filePath) => {
	// First constructing filePath to old image:
	filePath = path.join(__dirname, "..", filePath);
	// Then deleting old image:
	fs.unlink(filePath, (err) => console.log(err));
};
