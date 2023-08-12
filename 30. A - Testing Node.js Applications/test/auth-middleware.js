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
});
