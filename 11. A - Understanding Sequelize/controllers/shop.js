const Product = require("../models/product");
const Cart = require("../models/cart");

// Calls fetchAll in model, gets the products an returns Product List Page in Index:
exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then(products => {
      // Path seen from views folder defined in ejs
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch(err => {
      console.log(err);
    });
};

// Calls fetchAll in model, gets the products an returns Product List Page in Shop:
exports.getProducts = (req, res, next) => {
  Product.findAll()
  .then(products => {
    // Path seen from views folder defined in ejs
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All Products",
      path: "/products",
    });
  })
  .catch(err => {
    console.log(err);
  });
};

// Gets one product by its id through the URL and renders detail page:
exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  // Find product by Id without where keyword. Result is an object not an array
  Product.findByPk(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      })
    })
    .catch(err => {console.log(err)});

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
  // First  gets product by Id in Product model
  // Then adding product to cart in cart model. Passes also the price which  is needed there
  Product.findById(prodId, (product) => {
    Cart.addProduct(prodId, product.price);
  });
  res.redirect("/cart");
};

// Gets all products in cart and renders cart page
exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then(cart => {
      return cart
        .getProducts()
        .then(products => {
          res.render("shop/cart", {
            pageTitle: "Your Cart",
            path: "/cart",
            products: products,
          });
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
};

// Deletes product in cart
exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  // First  gets product by Id in Product model
  // Then deleting product in cart in Cart model
  Product.findById(prodId, (product) => {
    Cart.deleteProduct(prodId, product.price);
  });
  res.redirect("/cart");
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    pageTitle: "Your Orders",
    path: "/orders",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "/checkout",
  });
};
