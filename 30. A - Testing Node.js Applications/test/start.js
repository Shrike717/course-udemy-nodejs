const { expect } = require("chai");
const { it } = require("mocha"); // This runs the test
const expected = require("chai").expect; // This is ussed tto define the success-conditon

it("should add numbers correctly", function () {
	const num1 = 2;
	const num2 = 3;
	// Writing the success-condition
	expect(num1 + num2).to.equal(5);
});

it("should not give a result of 6", function () {
	const num1 = 2;
	const num2 = 3;
	// Writing the success-condition
	expect(num1 + num2).not.to.equal(6);
});
