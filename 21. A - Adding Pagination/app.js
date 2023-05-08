const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");

const errorController = require("./controllers/error");
const User = require("./models/user");

// Making use of express
const app = express();

// Initializing a store for storing sessions on MongoDB DB
const store = new MongoDBStore({
	uri: process.env.DB_URI,
	collection: "sessions",
});

// Configuration object for storing files:
const fileStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "images");
	},
	filename: (reg, file, cb) => {
		cb(null, new Date().toISOString() + "-" + file.originalname);
	},
});

// Filter for accepting only certain file mimetypes
const fileFilter = (req, file, cb) => {
	if (
		file.mimetype === "image/png" ||
		file.mimetype === "image/jpg" ||
		file.mimetype === "image/jpeg"
	) {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

// Initialising csrf protection:
const csrfProtection = csrf();

// Configurating and making use of EJS:
app.set("view engine", "ejs");
app.set("views", "./views");

// Importing the Routes:
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

// Middleware Parsing:
app.use(bodyParser.urlencoded({ extended: false }));

// Middleware multer initialised:
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single("image"));

//Middleware for serving files statically:
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));

// Middleware for intializing session
app.use(
	session({
		secret: "my secret",
		resave: false,
		saveUninitialized: false,
		store: store,
	})
);
// Using csrf Middleware AFTER creating session
app.use(csrfProtection);

// Initialising connect flash (Must be after session)
app.use(flash());

// Middleware to pass security information to every render function in controllers
app.use((req, res, next) => {
	res.locals.isAuthenticated = req.session.isLoggedIn;
	res.locals.csrfToken = req.csrfToken();
	next();
});

// Middleware to store the user again for every request as Mongoose object but fueled with data from Session
app.use((req, res, next) => {
	// throw new Error(" Sychronous Dummy error"); // In sychronous places i can throw an error
	if (!req.session.user) {
		return next(); // If we are logged out and therefore no user skips next block
	}
	User.findById(req.session.user._id) // Working with MG user modell again to have all build in methods
		.then((user) => {
			// throw new Error("Asynchronous Dummy error"); // Dummy error to test asynchronous error behaviour
			if (!user) {
				return next();
			}
			req.user = user;
			next();
		})
		.catch((err) => {
			next(new Error(err)); // In asynchronous places i have to wrap error in next()
		});
});

// Middleware for making use of Route Object adminRoutes with leading filter /admin
app.use("/admin", adminRoutes);
// Middleware for making use of Route Object shopRoutes:
app.use(shopRoutes);
// Middleware for making use of Route Object authRoutes:
app.use(authRoutes);

// Route for handling technical errors:
app.get("/500", errorController.get500);

// Catch-All Middleware for errors. Handles every request not handled before:
app.use(errorController.get404);

// Special error middleware with 4 arguments:
app.use((error, req, res, next) => {
	// res.status(error.httpStatusCode).render(...); // Another possibility to render page for user witth staus  code
	// res.redirect("/500"); // Redirect
	console.log(error);
	res.status(500).render("500", {
		pageTitle: "Technical error",
		path: "",
		isAuthenticated: req.session.isloggedIn,
	});
});

// Connection with mongoose.
mongoose
	.connect(process.env.DB_URI)
	.then((result) => {
		app.listen(3000);
	})
	.catch((err) => {
		console.log(err);
	});
