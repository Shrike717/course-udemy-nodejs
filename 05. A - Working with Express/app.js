const express = require("express");
const bodyParser = require("body-parser");

// Making use of express
const app = express();

// Importing the Admin Routes:
const adminRoutes = require("./routes/admin");
// Importing the Shop Routes:
const shopRoutes = require("./routes/shop");

// Middleware Parsing:
app.use(bodyParser.urlencoded({ extended: false }));

// Makingg use of Route Object adminRoutes:
app.use(adminRoutes);
// Makingg use of Route Object shopRoutes:
app.use(shopRoutes);
// Catch-All Middleware for errors:
app.use((req, res, next) => {
  res.status(404).send('<h1>Page not found!</h1>');
});

app.listen(3000);
