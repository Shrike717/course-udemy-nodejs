const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const errorController = require("./controllers/error");
const User = require("./models/user");

// Making use of express
const app = express();
// Initiallizing a store for storing sessions on MongodB DDB
const store = new MongoDBStore({
  uri: process.env.DB_URI,
  collection: "sessions",
});

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

// Middleware for making use of Route Object adminRoutes with leading filter /admin
app.use("/admin", adminRoutes);
// Middleware for making use of Route Object shopRoutes:
app.use(shopRoutes);
// Middleware for making use of Route Object authRoutes:
app.use(authRoutes);
// // Catch-All Middleware for errors:
app.use(errorController.get404);

// Connection with mongoose.
mongoose
  .connect(process.env.DB_URI)
  .then((result) => {
    User.findOne().then((user) => {
      // Checks in DB whether user is already defined. If yes loads it. Only new user if not.
      if (!user) {
        const user = new User({
          name: "Daniel",
          email: "daniel@test.com",
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
