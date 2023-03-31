const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");
const sequelize = require("./util/database");
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");

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
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to store user in request
app.use((req, res, next) => {
  User.findByPk(1)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => {console.log(err)})
});

// Making use of Route Object adminRoutes:
app.use('/admin', adminRoutes);
// Making use of Route Object shopRoutes:
app.use(shopRoutes);
// Catch-All Middleware for errors:
app.use(errorController.get404);

// Setting up relation a admin-user created a product: 1:n / n:1
Product.belongsTo(User, {constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
// Setting up relations between user and cart: 1:1
User.hasOne(Cart);
Cart.belongsTo(User);
// Setting up relation between cart and product. Needs join-table CartItem n:n
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
// Setting up relation between user and order. 1:n
Order.belongsTo(User);
User.hasMany(Order);
// Setting up relation between order and product. Needs join-table OrderItem n:n
Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });

// Syncing sequelize to database
// returning dummy user  or  creating it
// server listening in case of no error
sequelize
  // .sync({ force: true })
  .sync()
  .then(result => {
    return User.findByPk(1);
    // console.log(result);
  })
  .then(user => {
    if (!user) {
      return User.create({ name: "Daniel", email: "test@test.com" })
    }
    return user;
  })
  .then(user => {
    user.createCart()
  })
  .then(cart => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
});
