const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const rootDir = require("./util/path");

// Making use of express
const app = express();

// Configurating and making use of EJS:
app.set('view engine', 'ejs');
app.set('views', './views');

// Importing the Admin Routes:
const adminRoutes = require("./routes/admin");
// Importing the Shop Routes:
const shopRoutes = require("./routes/shop");

// Middleware Parsing:
app.use(bodyParser.urlencoded({ extended: false }));
//Middleware for serving files statically:
app.use(express.static(path.join(rootDir, 'public')));

// Making use of Route Object adminRoutes:
app.use('/admin', adminRoutes);
// Making use of Route Object shopRoutes:
app.use(shopRoutes);
// Catch-All Middleware for errors:
app.use((req, res, next) => {
  res.status(404).render("404", { pageTitle: "Page Not Found", path: "" });
});

app.listen(3000);
