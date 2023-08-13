const jwt = require("jsonwebtoken");
const sinon = require("sinon"); // Package for stubbing external functions
require("dotenv").config();

//  Importing expect function from chai package
const expect = require("chai").expect;

// Importing the parts we want to test:
const authMiddleware = require("../middleware/is-auth.js");

// With the describe function from Mocha i can group test:
describe("Auth middleware", function () {
	// Testing the auth-middleware if we get an error if no authorization header is present:
	it("should throw an error if no authorization header is present", function () {
		// Here WE have to call the middleware. Not express. We need to provide the needed arguments ourselves:
		// Creating the req object:
		const req = {
			get: function (headerName) {
				//  In the test case it should NOT return an Authorization header
				return null;
			},
		};
		// Now we have to let the test software call the middleware:
		expect(authMiddleware.bind(this, req, {}, () => {})).to.throw(
			"Not authenticated."
		);
	});

	// Testing the auth-middleware if we get an error if the Authorization header has only on string (token ot splittable):
	it("should throw an error if the authorization header is only one string", function () {
		// Creating the req object:
		const req = {
			get: function (headerName) {
				//  In the test case it should NOT return a splittable string
				return "abc";
			},
		};
		// Now we have to let the test software call the middleware:
		expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
	});

	// Testing the auth-middleware if we have a userId after successful authentication:
	it("should yield a userId after decoding the token", function () {
		// Creating the req object:
		const req = {
			get: function (headerName) {
				//  In the test case it should NOT return a verifiable jwt-token
				return "Bearer xyz";
			},
		};
		// We replace the verify function with a simpler function from us.
		// Not good, because it cannot be restored again and subsequent tests depending on the normal behaviour will fail
		// jwt.verify = function () {
		// 	return { userId: "abc" };
		// };

		// Sinon 01: We replace the verify function with a stub from sinon:
		sinon.stub(jwt, "verify");
		// Sinon 02: Then we configure what we need it to return:
		jwt.verify.returns({
			userId: "abc",
		});

		// Now WE call the middleware ourselves:
		authMiddleware(req, {}, () => {});

		// Now we expect the request to have a userId
		expect(req).to.have.property("userId");
		expect(req).to.have.property("userId", "abc");
		// testing wether the verify method is called:
		expect(jwt.verify.called).to.be.true;

		// Sinon 03: After checking our expectations we restore the external vverify method again:
		jwt.verify.restore();
	});

	// Testing the auth-middleware if we have a userId after successful authentication:
	// This creates a real token. Therefore it should pass the test
	// it("should yield a userId after decoding the token", async () => {
	// 	const token = await jwt.sign(
	// 		{
	// 			email: "test@test.com",
	// 			userId: "27",
	// 		},
	// 		process.env.JWT_SECRET,
	// 		{ expiresIn: "1h" }
	// 	);
	// 	const req = {
	// 		get: () => {
	// 			return "Bearer " + token;
	// 		},
	// 	};
	// 	authMiddleware(req, {}, () => {});
	// 	expect(req).to.have.property("userId");
	// });

	// Testing the auth-middleware if we get an error when we have a malformed JWT-token:
	it("should throw an error if the token cannot be verified", function () {
		// Creating the req object:
		const req = {
			get: function (headerName) {
				//  In the test case it should NOT return a verifiable jwt-token
				return "Bearer xyz";
			},
		};
		// Now we have to let the test software call the middleware:
		expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
	});
});
