const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");
const sequelize = require("./util/database");
const Product = require("./models/product");
const User = require("./models/user");

// Making use of express
const app = express();

// Configurating and making use of EJS:
app.set('view engine', 'ejs');
app.set('views', './views');

// Importing the Admin Routes:
const adminRoutes = require("./routes/admin");
// Importing the Shop Routes:
const shopRoutes = require("./routes/shop");
const { HasMany } = require("sequelize");

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

// Setting up relation a user created a product:
Product.belongsTo(User, {constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);

// Syncing sequelize to database and server listening in case of no error
sequelize.sync({ force: true })
.then(result => {
  // console.log(result);
  app.listen(3000);
})
.catch(err => {
  console.log(err);
});
