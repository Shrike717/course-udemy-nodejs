const sum = (a, b) => {
	if (a && b) {
		return a + b;
	}
	throw new Error("Invalid arguments!");
};

// Handling of technical error in synchronous code:
try {
	console.log(sum(1));
} catch (error) {
    console.log("Error in synchronous code ocurred!");
    // console.log(error);
}

// console.log(sum(1));
console.log("This works!")
