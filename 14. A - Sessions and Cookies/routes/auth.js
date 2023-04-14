const express = require("express");

const authController = require("../controllers/auth");

// Making use of Router Module:
const router = express.Router();

router.get("/login", authController.getLogin);

module.exports = router;
