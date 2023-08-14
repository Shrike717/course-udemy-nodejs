const jwt = require("jsonwebtoken");
const sinon = require("sinon"); // Package for stubbing external functions
require("dotenv").config();
const mongoose = require("mongoose");

//  Importing expect function from chai package
const expect = require("chai").expect;

// Importing the needed parts we want to test:
const User = require("../models/user.js");
const AuthController = require("../controllers/auth.js");

describe("Auth Controller-Login", () => {
	// Test to check wether an error 500 is thrown when DB access failes for some reason
	it("should throw an error code 500 when accessing the DB fails", (done) => {
		// Stubbing the DB connection
		sinon.stub(User, "findOne");
		// And configuring the findOne method to now throw an error
		User.findOne.throws();

		// Constructing the needed req:
		const req = {
			body: {
				email: "test@test.com",
				password: "testt",
			},
		};

		// Expectation: When the login function in the AuthController is called it should throw an error 500
		AuthController.login(req, {}, () => {})
			.then((result) => {
				expect(result).to.be.an("error");
				expect(result).to.have.a.property("statusCode", 500);
				// Dealing with async code usin the done() function from Mocha.
				done();
			})
			.catch((err) => {
				done(err);
			});

		// Restoring findOne method again
		User.findOne.restore();
	});

	// Testing if we get a response with a valid user status:
	// Requuires  done keyword because communicating with DB is async code
	it("should return a response with a valid user status for an existing user", (done) => {
		// First we have to setup a connection to our test-DB
		mongoose
			.connect(process.env.DB_URI_TEST, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
			})
			.then((result) => {
				// Defining the testin logic:
				// First we need a dummy user
				const user = new User({
					email: "test@test.com",
					passsword: "test",
					name: "Tester",
					posts: [],
				});
				// Then saving the user to DB and return result as promise
				return user.save();
			})
			.then(() => {})
			.catch((err) => console.log(err));
	});
});
