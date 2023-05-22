const mongoose = require("mongoose");
const { validationResult } = require("express-validator");

const Post = require("../models/post");

exports.getPosts = (req, res, next) => {
	Post.find()
		.then((posts) => {
			res.status(200).json({ // Sending response with json() method
				message: "Posts loaded successfully!",
				posts: posts,
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
    console.log(req.body);
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
		creator: {
			name: "Daniel Bauer",
		},
	});
	// It has to be saved to DB. Gives back promise like object:
	post.save()
		.then((result) => {
			console.log(result);
			res.status(201).json({ // Sending response with json() method
				message: "Post created successfully!",
				post: result, // result is the post coming back from the DB
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
	Post;
};
