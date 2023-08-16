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
import fs from "fs"; // ES modules import

export const resHandler = (req, res, next) => {
	fs.readFile("my-page.html", "utf8", (err, data) => {
		res.send(data);
	});
};
