const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const feedRoutes = require("./routes/feed");

const app = express();

// Parsing incoming JSON data from request bodies (applicaton/json)
app.use(bodyParser.json());

// Setting headers to avoid CORS error to every response before requests are routed further in our app
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

// Connecting to Mongo Db with Mongoose:
mongoose
	.connect(process.env.DB_URI)
	.then((result) => {
		app.listen(8080);
	})
	.catch((err) => {
		console.log(err);
	});
