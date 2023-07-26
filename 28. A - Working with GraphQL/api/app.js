const express = require("express");
const path = require("path"); // Needed to build path for serving the images folder statically
const bodyParser = require("body-parser");
const multer = require("multer"); // Parser for images
const mongoose = require("mongoose");
require("dotenv").config();
const { createHandler } = require("graphql-http/lib/use/express"); // Package used to parse incomings requests

const graphqlSchema = require("./graphql/schema");
const graphqlResolver = require("./graphql/resolvers");
const auth = require("./middleware/auth");
const { clearImage } = require("./util/file.js");

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

// Register Middleware to parse incoming files with multer:
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
	// Checks if request method is OPIONS and then returns OK status 200 immediately not hitting next afterwards
	if (req.method === "OPTIONS") {
		return res.sendStatus(200);
	}
	next();
});

// Middleware to check if user is authenticated:
app.use(auth);

// Th only REST endpoint is needed for uploading images:
app.put("/post-image", (req, res, next) => {
	// This check protects the route
	if (!req.isAuth) {
		throw new Error("Not authenticated!");
	}
	// Checking if a / new image was added. If not, we are done
	if (!req.file) {
		return res.status(200).json({ message: "No file provided." });
	}

	// If there is an old image we delete it
	if (req.body.oldPath) {
		clearImage(req.body.oldPath);
	}
	return res
		.status(201)
		.json({ message: "File stored", filePath: req.file.path }); // Sending back the imageUrl
});

// Middlleware for gaphql:
app.all("/graphql", (req, res) =>
	createHandler({
		schema: graphqlSchema,
		// rootValue: graphqlResolver,
		rootValue: {
			createUser: (args) => graphqlResolver.createUser(args, req), // For use with graphql-http
			login: (args) => graphqlResolver.login(args, req),
			createPost: (args) => graphqlResolver.createPost(args, req),
			getPosts: (args) => graphqlResolver.getPosts(args, req),
			getPost: (args) => graphqlResolver.getPost(args, req),
			updatePost: (args) => graphqlResolver.updatePost(args, req),
			deletePost: (args) => graphqlResolver.deletePost(args, req),
			user: (args) => graphqlResolver.user(args, req),
			updateStatus: (args) => graphqlResolver.updateStatus(args, req),
		},
		// This handles "custom" errors:
		formatError: (err) => {
			if (!err.originalError) {
				return err;
			}
			const data = err.originalError.data;
			const message = err.message || "An error occurred.";
			const code = err.originalError.code || 500;
			return {
				message: message,
				// locations: err.locations,
				path: err.path,
				status: code,
				data: data,
				stack: err.stack ? err.stack.split("\n") : [],
			};
		},
	})(req, res)
);

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
		app.listen(process.env.PORT);
		console.log(
			`Server running on port: ${process.env.PORT} -----------------------------------------`
		);
	})
	.catch((err) => {
		console.log(err);
	});
