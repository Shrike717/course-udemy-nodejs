const mongoose = require("mongoose");
const { validationResult } = require("express-validator");

const Post = require("../models/post");

exports.getPosts = (req, res, next) => {
	res.status(200).json({
		posts: [
			{
				_id: "1",
				title: "First post",
				content: "This is my first post!",
				imageUrl: "images/Book.jpg",
				creator: {
					name: "Daniel Bauer",
				},
				createdAt: new Date(),
			},
		],
	});
};

exports.createPost = (req, res, next) => {
	// Errors the validator package might have gathered
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
        const error = new Error("Validation failed! Entered data is incorrect.");
        error.statusCode = 422;
        throw error; // Synchronous code therefor throw
	}
    // Extracting payload from body
	const title = req.body.title;
	const content = req.body.content;

	// Create post in db
	const post = new Post({
		title: title,
		imageUrl: "images/Book.jpg",
		content: content,
		creator: {
			name: "Daniel Bauer",
		},
	});
    // It has to be saved to DB. Gives back promise like object:
	post.save()
		.then((result) => {
			console.log(result);
			res.status(201).json({
				message: "Post created successfully!",
				post: result, // result is the post coming back from the DB
			});
		})
		.catch((err) => {
			if (!err.statusCode){
                err.statusCode = 500;
            }
            next(err); // Asynchronous code. Therefore forwarding err with next
		});
};
