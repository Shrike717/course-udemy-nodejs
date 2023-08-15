const jwt = require("jsonwebtoken");
const sinon = require("sinon"); // Package for stubbing external functions
require("dotenv").config();
const mongoose = require("mongoose");

//  Importing expect function from chai package
const expect = require("chai").expect;

// Importing the needed parts we want to test:
const User = require("../models/user.js");
const Post = require("../models/post.js");
const FeedController = require("../controllers/feed.js");

describe("Feed Controller", () => {
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

	// This are the hooks to wrap it test functions:
	// beforeEach(() => {});
	// // it()....
	// afterEach(() => {});

	// Test to check wether a post is created and added to the posts array of the user
	it("should add a created post to the posts array of the creating user", (done) => {
		// Constructing the needed req:
		const req = {
			body: {
				title: "Test Post Title",
				content: "Test Post Content",
			},
			file: {
				path: "test-url",
			},
			userId: "64da075995dd424598ff7adc",
		};
		// We have tp provide a dummy res object because it needs to have a status and a json function.
		const res = {
			status: function () {
				return this; // We have to return this otherwise the json function in the controller doesn't work
			},
			json: function () {},
		};

		// Expectation: When the createPost function in the FeedController is called it should create a new post and add it to the posts array of the creating user
		FeedController.createPost(req, res, () => {})
			.then((savedUser) => {
				expect(savedUser).to.have.a.property("posts");
				expect(savedUser.posts).to.have.length(1);
				done();
			})
			.catch((err) => {
				done(err);
			});
	});

	// Cleaning the posts after this test
	afterEach((done) => {
		Post.deleteMany({}).then(() => {
			done();
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
