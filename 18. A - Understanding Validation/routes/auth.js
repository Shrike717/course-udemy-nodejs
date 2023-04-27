const express = require("express");
const { check, body } = require("express-validator");

const authController = require("../controllers/auth");
const User = require("../models/user");

// Making use of Router Module:
const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post("/login", authController.postLogin);

router.post(
	"/signup",
	[
		check("email")
			.isEmail()
			.withMessage("Please enter a valid email.")
			.custom((value, { req }) => {
				// if (value === "test@test.com") { // We leave this code as example
				// 	throw new Error("This email adress iss forbidden!");
				// }
				// return true;
				return User.findOne({ email: value }).then((userDoc) => {
					if (userDoc) {
						return Promise.reject("E-mail already exists!");
					}
				});
			}),
		body(
			"password",
			"Please enter a password with only numbers and text with at least 5 characters!"
		)
			.isLength({ min: 5 })
			.isAlphanumeric(),
		body("confirmPassword").custom((value, { req }) => {
			if (value !== req.body.password) {
				throw new Error("Password doesn't match!");
			}
			return true;
		}),
	],
	authController.postSignup
);

router.post("/logout", authController.postLogout);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
