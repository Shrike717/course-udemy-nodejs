const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");

const errorController = require("./controllers/error");
const User = require("./models/user");

// Making use of express
const app = express();

// Initializing a store for storing sessions on MongoDB DB
const store = new MongoDBStore({
	uri: process.env.DB_URI,
	collection: "sessions",
});

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

//Middleware for serving files statically:
app.use(express.static(path.join(__dirname, "public")));

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

// Middleware to store the user again for every request as Mongoose object but fueled with data from Session
app.use((req, res, next) => {
	if (!req.session.user) {
		return next(); // If we are logged out and therefore no user skips next block
	}
	User.findById(req.session.user._id) // Working with MG user modell again to have all build in methods
		.then((user) => {
			if (!user) {
				return next();
			}
			req.user = user;
			next();
		})
		.catch((err) => {
			throw new Error(err);
		});
});

// Middlewaree to pass security informattion to every render function in controllers
app.use((req, res, next) => {
	res.locals.isAuthenticated = req.session.isLoggedIn;
	res.locals.csrfToken = req.csrfToken();
	next();
});

// Middleware for making use of Route Object adminRoutes with leading filter /admin
app.use("/admin", adminRoutes);
// Middleware for making use of Route Object shopRoutes:
app.use(shopRoutes);
// Middleware for making use of Route Object authRoutes:
app.use(authRoutes);

// Route for handlng technical errors:
app.get("/500", errorController.get500);

// Catch-All Middleware for errors. Handles every request not handled before:
app.use(errorController.get404);

// Connection with mongoose.
mongoose
	.connect(process.env.DB_URI)
	.then((result) => {
		app.listen(3000);
	})
	.catch((err) => {
		console.log(err);
	});
