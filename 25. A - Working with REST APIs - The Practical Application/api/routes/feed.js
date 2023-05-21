const express = require("express");

const { body } = require("express-validator");

const feedController = require("../controller/feed");

const router = express.Router(); // Creating the router

// GET /feed/posts will be handled. There is a pre-filter "/feed" in app.js
router.get("/posts", feedController.getPosts);

// POST /feed/post
router.post(
	"/post",
	[
		body("title").trim().isLength({ min: 7 }),
		body("content").trim().isLength({ min: 7 }),
	],
	feedController.createPost
);

router.get("/post/:postId", feedController.getPost);

module.exports = router;
