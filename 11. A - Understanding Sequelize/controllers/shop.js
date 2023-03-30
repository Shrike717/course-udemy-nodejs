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
    .catch(err => console.log(err));

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
  let fetchedCart; // Making cart available for all blocks
  let newQuantity = 1; // Making new quantity available in all blocks
  req.user
  .getCart() // Gets access to the cart
  .then(cart => {  // Now cart is available
    fetchedCart = cart;
    return cart.getProducts({ where: { id: prodId } }) // Checks if newly added product is already in cart
  })
  .then(products => { // cart.getProducts gives back array of products with zero or one product. But we only need first element.
    let product;
    if (products.length > 0) { // Checks if p. already in cart and extracts it
      product = products[0];
    }
    if (product) { // If there is already a p. increase qty
      const oldQuantity = product.cartItem.quantity; // CartItem is an object for table cartItems given by Sequelize
      newQuantity = oldQuantity + 1;
      return product;
    }
    return Product
      .findByPk(prodId) // If p. wasn't in cart get it from products table and returns it
  })
  .then(product => { // Adds either returned p. which was already in cart or returned p. which wasn't in cart to cart
    return fetchedCart.addProduct(product, { through: { quantity: newQuantity } }) // Magical method for n:n relations. Adds p. to carts and cartItems table and changes quantity in cartItems
  })
  .then(() => {
    res.redirect("/cart");
  })
  .catch(err => console.log(err));
};

// Gets all products in cart and renders cart page
exports.getCart = (req, res, next) => {
  req.user
    .getCart() // Gets access to the cart
    .then(cart => { // Now cart is available
      return cart
        .getProducts() // Magical S. method
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
  // First  gets product by Id in Product model
  const prodId = req.body.productId;
  req.user
    .getCart()
    .then(cart => {
      return cart.getProducts({ where: { id: prodId }});
    })
    .then(products => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then(result => {
      res.redirect("/cart");
    })
    .catch(err => console.log(err));
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
