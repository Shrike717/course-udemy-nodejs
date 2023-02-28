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

app.listen(3000);
