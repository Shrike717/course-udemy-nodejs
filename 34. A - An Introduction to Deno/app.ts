const text = "This is a test and should be stored in a file!";

// Using the global function TextEncoder to convert our textt into an array of bytes:
const encoder = new TextEncoder();
const data = encoder.encode(text);

// writeFile retuns a promise
Deno.writeFile("message.txt", data).then(() => {
	console.log("Wrote to file!");
});
