const express = require("express");
const path = require("path"); // Needed to build path for serving the images folder statically
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const feedRoutes = require("./routes/feed");

const app = express();

// Middleware for parsing incoming JSON data from request bodies (applicaton/json)
app.use(bodyParser.json());

// Middleware for serving the images folder statically:
app.use("/images", express.static(path.join(__dirname, "images")));

// Middleware for setting headers to avoid CORS error to every response before requests are routed further in our app
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, PUT, PATCH, DELETE"
	);
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Content-Type, Authorization"
	);
	next();
});

app.use("/feed", feedRoutes);

// Middleware for central custom error handling:
app.use((error, req, res, next) => {
	console.log(error); // Logging it for Devs to see
	const status = error.statusCode || 500; // Extracting our custom property statusCode we were setting before to an error object. Or 500
	const message = error.message; // Extracting default property message (The messagge we passed  to the error constuctor before)
	res.status(status).json({ message: message });
});

// Connecting to Mongo Db with Mongoose:
mongoose
	.connect(process.env.DB_URI)
	.then((result) => {
		app.listen(8080);
	})
	.catch((err) => {
		console.log(err);
	});
