const Product = require("../models/product");

// Calls fetchAll in model, gets the products an returns Product List Page in Index:
exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      // Path seen from views folder defined in ejs
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

// Calls fetchAll in model, gets the products an returns Product List Page in Shop:
exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      // Path seen from views folder defined in ejs
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

// Gets one product by its id through the URL and renders detail page:
exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  // Find product by Id in Product model. Result is an object not an array
  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));

  // Sends wanted product id to Model and gets back wanted product in nested array.
  // Then sends product data as first element from array to view and renders product details
  // Product.findAll({ where: {
  //   id: prodId,
  // } })
  //   .then( product => {
  //     res.render("shop/product-detail", {
  //       product: product[0],
  //       pageTitle: product[0].title,
  //       path: "/products",
  //     });
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   })
};

// Gets product by its Id through the body from post request and adds product to cart
exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId) // Finds product in DB
    .then((product) => {
      return req.user.addToCart(product); // Calls method in user model.Prooduct  is needed there to update cart in users
    })
    .then((result) => {
      console.log(result);
      res.redirect("/cart");
    });
};

// Gets all products in cart and renders cart page
exports.getCart = (req, res, next) => {
  req.user
    .getCart() // Gets access to the cart
    .then((products) => {
      res.render("shop/cart", {
        pageTitle: "Your Cart",
        path: "/cart",
        products: products,
      });
    })
    .catch((err) => console.log(err));
};

// Deletes product in cart
exports.postCartDeleteProduct = (req, res, next) => {
  // First  gets product by Id in Product model
  const prodId = req.body.productId;
  req.user
    .deleteItemFromCart(prodId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

// Creating an order:
exports.postOrder = (req, res, next) => {
  req.user
    .addOrder()
    .then((result) => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};

// Getting orders and displaying them on orders Page
exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({ include: ["products"] })
    .then((orders) => {
      res.render("shop/orders", {
        pageTitle: "Your Orders",
        path: "/orders",
        orders: orders,
      });
    })
    .catch((err) => console.log(err));
};
