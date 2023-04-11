const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const errorController = require("./controllers/error");
const User = require("./models/user");

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

// Middleware to store user in request
app.use((req, res, next) => {
  User.findById("643579d57d06c46ba7a0313d")
    .then((user) => {
      req.user = user; // Full Mongoose object with all methods
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

// Middleware for making use of Route Object adminRoutes:
app.use("/admin", adminRoutes);
// Middleware for making use of Route Object shopRoutes:
app.use(shopRoutes);
// // Catch-All Middleware for errors:
app.use(errorController.get404);

// Connection with mongoose.
mongoose
  .connect(process.env.DB_URI)
  .then((result) => {
    User.findOne().then((user) => { // Checks whether user is already defined. Only new user if not.
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
