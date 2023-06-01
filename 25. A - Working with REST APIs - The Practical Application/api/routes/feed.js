const express = require("express");

const { body } = require("express-validator");

const feedController = require("../controller/feed");
const isAuth = require("../middleware/is-auth"); // Middleware to check JWT token

const router = express.Router(); // Creating the router

// GET /feed/posts will be handled. There is a pre-filter "/feed" in app.js
router.get("/posts", isAuth, feedController.getPosts);

// POST /feed/post
router.post(
	"/post",
	[
		body("title").trim().isLength({ min: 5 }),
		body("content").trim().isLength({ min: 5 }),
	],
	feedController.createPost
);

router.get("/post/:postId", feedController.getPost);

// Editing a post:
router.put("/post/:postId",
    [
        body("title").trim().isLength({ min: 5 }),
        body("content").trim().isLength({ min: 5 }),
    ],
    feedController.updatePost
);

// Deleting a post:
router.delete("/post/:postId", feedController.deletePost);

module.exports = router;
