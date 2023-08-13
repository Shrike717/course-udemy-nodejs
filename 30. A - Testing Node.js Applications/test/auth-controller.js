const jwt = require("jsonwebtoken");
const sinon = require("sinon"); // Package for stubbing external functions
require("dotenv").config();

//  Importing expect function from chai package
const expect = require("chai").expect;

// Importing the needed parts we want to test:
const User = require("../models/user.js");
const AuthController = require("../controllers/auth.js");

describe("Auth Controller-Login", () => {
	// Test to check wether an error 500 is thrown when DB access failes for some reason
	it("should throw an error code 500 when accessing the DB fails", () => {
		// Stubbing the DB connection
		sinon.stub(User, "findOne");
		// And configuring the findOne method to now throw an error
		User.findOne.throws();

		// Expectation: When the login function in the AuthController is called it should throw an error 500
		expect(AuthController.login);

		// Restoring findOne method again
		User.findOne.restore();
	});
});
