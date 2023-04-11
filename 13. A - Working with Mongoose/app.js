const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const errorController = require("./controllers/error");
// const User = require("./models/user");

// Making use of express
const app = express();

// Configurating and making use of EJS:
app.set("view engine", "ejs");
app.set("views", "./views");

// Importing the Admin Routes:
const adminRoutes = require("./routes/admin");
// Importing the Shop Routes:
const shopRoutes = require("./routes/shop");

// Middleware Parsing:
app.use(bodyParser.urlencoded({ extended: false }));
//Middleware for serving files statically:
app.use(express.static(path.join(__dirname, "public")));

// // Middleware to store user in request
// app.use((req, res, next) => {
//   User.findById("642c212665d957affe547b83")
//     .then((user) => {
//       req.user = new User(user.name, user.email, user.cart, user._id);
//       next();
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

// Middleware for making use of Route Object adminRoutes:
app.use("/admin", adminRoutes);
// Middleware for making use of Route Object shopRoutes:
app.use(shopRoutes);
// // Catch-All Middleware for errors:
app.use(errorController.get404);

// Connection with mongoose.
mongoose
  .connect(process.env.DB_URI)
  .then(result => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
