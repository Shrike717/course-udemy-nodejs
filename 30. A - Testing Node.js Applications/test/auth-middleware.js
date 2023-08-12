//  Importing expect function from chai package
const expect = require("chai").expect;

// Importing the parts we want to test:
const authMiddleware = require("../middleware/is-auth.js");

// Testing the auth-middleware if we get an error if no authorization header is present:
it("should throw an error if no authorization header is present", function () {
	// Here WE have to call the middleware. Not express. We need to provide the needed arguments ourselves:
	// Creating the req object:
	const req = {
		get: function () {
			//  In the test case it should NOT return an Authorization header
			return null;
		},
	};
	// Now we have to call the middleware ourselves:
	expect(authMiddleware.bind(this, req, {}, () => {})).to.throw(
		"Not authenticated."
	);
});
