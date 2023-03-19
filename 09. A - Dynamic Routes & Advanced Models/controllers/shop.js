const Product = require("../models/product");

// Calls fetchAll in model, gets the products an returns Product List Page in Index:
exports.getIndex = (req, res, next) => {
  Product.fetchAll((products) => {
    // Path seen from views folder defined in ejs
    res.render("shop/index", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
    });
  });
};

// Calls fetchAll in model, gets the products an returns Product List Page in Shop:
exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    // Path seen from views folder defined in ejs
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All Products",
      path: "/products",
    });
  });
};

// Gets one product by its id through the URL:
exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  // Sends wanted product id to Model and gets back wanted product object.
  // Then sends product data to view and renders product details
  Product.findById(prodId, product => {
    res.render("shop/product-detail", {
      product,
      pageTitle: product.title,
      path: "/products"
    })
  });
};

// Gets product by its Id through the body from post request
exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  console.log(prodId);
  res.redirect("/cart");
};

exports.getCart = (req, res, next) => {
  res.render("shop/cart", {
    pageTitle: "Your Cart",
    path: "/cart"
  })
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    pageTitle: "Your Orders",
    path: "/orders"
  })
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "/checkout"
  })
};
