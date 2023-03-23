const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");
const db = require("./util/database");

// Making use of express
const app = express();

// Configurating and making use of EJS:
app.set('view engine', 'ejs');
app.set('views', './views');

// Importing the Admin Routes:
const adminRoutes = require("./routes/admin");
// Importing the Shop Routes:
const shopRoutes = require("./routes/shop");

db.execute("SELECT * FROM products").then().catch();

// Middleware Parsing:
app.use(bodyParser.urlencoded({ extended: false }));
//Middleware for serving files statically:
app.use(express.static(path.join(__dirname, 'public')));

// Making use of Route Object adminRoutes:
app.use('/admin', adminRoutes);
// Making use of Route Object shopRoutes:
app.use(shopRoutes);
// Catch-All Middleware for errors:
app.use(errorController.get404);

app.listen(3000);
