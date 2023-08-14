const jwt = require("jsonwebtoken");
const sinon = require("sinon"); // Package for stubbing external functions
require("dotenv").config();
const mongoose = require("mongoose");

//  Importing expect function from chai package
const expect = require("chai").expect;

// Importing the needed parts we want to test:
const User = require("../models/user.js");
const AuthController = require("../controllers/auth.js");

describe("Auth Controller", () => {
	// We create a lifecycle with before:
	before(function (done) {
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
					password: "test",
					name: "Tester",
					posts: [],
					_id: "64da075995dd424598ff7adc", // To simplfy testing we also set a valid Mongo userId
				});
				// Then saving the user to DB and return result as promise
				return user.save();
			})
			.then(() => {
				done();
			});
	});
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
		// Now creating the needed req objct:
		const req = {
			userId: "64da075995dd424598ff7adc",
		};
		// And the creating a response object:
		const res = {
			statusCode: 500, // Initial status code differs from 200
			userStatus: null, // Initial User status. Will be overwritten with status from DB later
			status: function (code) {
				this.statusCode = code; // We overwrite statusCode with status code from DB
				return this; // This status function returns the whole response object again. Needed to chain json()
			},
			// This function recieves the objectt from json method in controller function
			json: function (data) {
				this.userStatus = data.status; // Overwrite userStatus with result from json method in controller function
			},
		};
		// Then run the test code calling the controller function
		AuthController.getUserStatus(req, res, () => {})
			.then(() => {
				// This callback executes once my controller is done. Now i can define the expectations
				// We expect the res object to have a status code of 200
				expect(res.statusCode).to.be.equal(200);
				expect(res.userStatus).to.be.equal("I am new!");
				done();
			})
			.catch((err) => {
				done(err);
			});
	});

	// Here we clean up the user and disconnect once after the tests are finished
	after((done) => {
		// Cleaning up the user again before disconnecting from DB
		User.deleteMany({})
			.then(() => {
				// Deletes all users
				// Closing the connection to the DB before calling done(). This quits the test process
				return mongoose.disconnect();
			})
			.then(() => {
				done();
			});
	});
});
