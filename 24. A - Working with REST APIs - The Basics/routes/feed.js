const express = require("express");

const feedController = require("../controller/feed");

const router = express.Router(); // Creating the routr

// GET /feed/posts will be handled. There is a pre-filter "/feed" in app.js
router.get("/posts", feedController.getPosts);

// POST /feed/post
router.post("/post", feedController.createPost);

module.exports = router;
