// This is a comparison of ccreating a file in node and writin to it:

// We import the file system from the promise part of the core module
const fs = require("fs").promises;

const text = "This is a test and should be stored in a file!";

fs.writeFile("node-message.text", text).then(() => {
	console.log("Wrrote to file");
});
