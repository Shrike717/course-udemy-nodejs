const num1Element = document.getElementById("num1") as HTMLInputElement;
const num2Element = document.getElementById("num2") as HTMLInputElement;
const buttonElement = document.querySelector("button")!;

// Here we initialize two arrays and define them as array-types:
const numResult: number[] = [];
const textResult: string[] = [];

function add(num1: number | string, num2: number | string) {
	// Running different code for different types of inputs
	if (typeof num1 === "number" && typeof num2 === "number") {
		return num1 + num2;
	} else if (typeof num1 === "string" && typeof num2 === "string") {
		return num1 + " " + num2;
	} else {
		// For mixed types we force a conversion to a number
		return +num1 + +num2;
	}
}

// Function which receives an object:
// Here the object type is defined
function printResult(resultObj: { val: number; timestamp: Date }) {
	console.log(resultObj.val, resultObj.timestamp);
}

// Possibily 1 to check if there is a button element:
if (buttonElement) {
	// Adding eventlistener:
	buttonElement.addEventListener("click", () => {
		// Now extacting the values of the input fields.
		const num1 = num1Element.value;
		const num2 = num2Element.value;
		// Now passing the value of the function:
		const result = add(+num1, +num2);
		// Pushing the result to array:
		numResult.push(result as number);
		// We also need to have the functon working with strings
		const stringResult = add(num1, num2);
		// Pushing the result to array:
		textResult.push(stringResult as string);
		// Login the arrays
		console.log(numResult, textResult);

		// When we call printResult we have to pass an object which contains the structure and types as defined above
		printResult({ val: result as number, timestamp: new Date() });
	});
}
