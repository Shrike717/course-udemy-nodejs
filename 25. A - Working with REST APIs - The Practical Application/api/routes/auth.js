const express = require("express");

const { body } = require("express-validator");

const authController = require("../controller/auth");

const router = express.Router(); // Creating the router

router.put("/signup");

module.exports = router;
