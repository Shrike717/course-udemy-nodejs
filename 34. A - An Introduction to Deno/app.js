// // This is a comparison of creating a file in node and writing to it:

// // We import the file system from the promise part of the core module
// const fs = require("fs").promises;

// const text = "This is a test and should be stored in a file!";

// fs.writeFile("node-message.text", text).then(() => {
// 	console.log("Wrrote to file");
// });

// ****************************************************************

// This is a comparison of creating a Node server

// First we have  to import the http functionality
const http = require("http");

// Then createServer() needs a function with gets the incoming rquest an the rsponse object and  will be executed
// for every incoming request
const server = http.createServer((req, res) => {
	// then we call the end() method on the response object and send it back
	res.end("Hello World (From Node)!");
});

// To now spin up the above created server we need to listen to requests at a port
server.listen(3000);
