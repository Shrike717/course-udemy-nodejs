// **** Common JS import and export ****
// const fs = require("fs");

// const resHandler = (req, res, next) => {
// 	fs.readFile("my-page.html", "utf8", (err, data) => {
// 		res.send(data);
// 	});
// };

// module.exports = resHandler;

// **** ES modules import and export: Export with keyword export as default: ****
// import fs from "fs"; // ES modules import

// const resHandler = (req, res, next) => {
// 	fs.readFile("my-page.html", "utf8", (err, data) => {
// 		res.send(data);
// 	});
// };

// export default resHandler;

// **** ES modules import and export: Export as named export with keyword export as single function: ****
// import fs from "fs"; // ES modules import

// export const resHandler = (req, res, next) => {
// 	fs.readFile("my-page.html", "utf8", (err, data) => {
// 		res.send(data);
// 	});
// };

// **** ES modules import and export: Constructing global variables again ****
// import path from "path";

// We need this helpers to construct global variables like __dirname or __filename
// import * as url from "url";
// const __filename = url.fileURLToPath(import.meta.url);
// const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

// export const resHandler = (req, res, next) => {
// 	// fs.readFile("my-page.html", "utf8", (err, data) => {
// 	// 	res.send(data);
// 	// });
// 	// We construct the path: __dirname is our actual folder, then we would need folder if any, then the filename
// 	res.sendFile(path.join(__dirname, "my-page.html"));
// };

// **** Using the Promise API for core module fs instead of a calllback function: ****
// This is the promise functionality using then and catch:
// import fs from "fs/promises"; // ES modules import from Promise API

// export const resHandler = (req, res, next) => {
// 	// This is the callback functionality:
// 	// fs.readFile("my-page.html", "utf8", (err, data) => {
// 	// 	res.send(data);
// 	// });

// 	// This is the promise functionality using then and catch:
// 	fs.readFile("my-page.html", "utf8")
// 		.then((data) => res.send(data))
// 		.catch((err) => console.log(err));
// };

// **** Using the Promise API for core module fs instead of a calllback function: ****
// This is the promise functionality using async and await:
import fs from "fs/promises"; // ES modules import from Promise API

export const resHandler = async (req, res, next) => {
	// This is the callback functionality:
	// fs.readFile("my-page.html", "utf8", (err, data) => {
	// 	res.send(data);
	// });

	// This is the promise functionality using try and catch:
	try {
		const data = await fs.readFile("my-page.html", "utf8");
		res.send(data);
	} catch (error) {
		console.log(error);
	}
};
