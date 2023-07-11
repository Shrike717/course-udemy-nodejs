const express = require("express");
const path = require("path"); // Needed to build path for serving the images folder statically
const bodyParser = require("body-parser");
const multer = require("multer"); // Parser for images
const mongoose = require("mongoose");
require("dotenv").config();

const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");

const app = express();

// Configuring a storage where multer saves parsed images and a naming convention how files will be named:
const fileStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "images"); // Setting folder
	},
	filename: (req, file, cb) => {
		cb(null, new Date().toISOString() + "-" + file.originalname); // Setting name
	},
});

// Configuring file filter for multer to check for certain mimetypes:
const fileFilter = (req, file, cb) => {
	if (
		file.mimetype === "image/png" ||
		file.mimetype === "image/jpg" ||
		file.mimetype === "image/jpeg"
	) {
		cb(null, true); // File is valid
	} else {
		cb(null, false); // Orr not
	}
};

// Register Middleware for parsing incoming JSON data from request bodies (applicaton/json)
app.use(bodyParser.json());

// Register Middleware to parse incomiing files with multer:
app.use(
	multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

// Middleware for serving the images folder statically:
app.use("/images", express.static(path.join(__dirname, "images")));

// Middleware for setting headers to avoid CORS error to every response before requests are routed further in our app
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*"); // Accepting all Client servers with wildcart
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

// Forwarding requests with prefixes to the routers
app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);

// Middleware for central custom error handling:
app.use((error, req, res, next) => {
	console.log(error); // Logging it for Devs to see
	const status = error.statusCode || 500; // Extracting our custom property statusCode we were setting before to an error object. Or 500
	const message = error.message; // Extracting default property message (The messagge we passed  to the error constuctor before)
	const data = error.data;
	res.status(status).json({ message: message, data: data });
});

// Connecting to Mongo Db with Mongoose:
mongoose
	.connect(process.env.DB_URI)
	.then((result) => {
		const server = app.listen(process.env.PORT);

		const io = require("./socket").init(
			// Establish connection with websocket
			server,

			{
				// We have o set CORS headers
				cors: {
					origin: "*",

					methods: ["GET", "POST", "PUT", "DELETE", "PUT"],
				},
			}
		);

		io.on(
			"connection",

			(socket) => {
				console.log("Client connected");
			}
		);
	})
	.catch((err) => {
		console.log(err);
	});
