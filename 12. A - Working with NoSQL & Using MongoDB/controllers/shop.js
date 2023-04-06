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

  // let fetchedCart; // Making cart available for all blocks
  // let newQuantity = 1; // Making new quantity available in all blocks
  // req.user
  // .getCart() // Gets access to the cart
  // .then(cart => {  // Now cart is available
  //   fetchedCart = cart;
  //   return cart.getProducts({ where: { id: prodId } }) // Checks if newly added product is already in cart
  // })
  // .then(products => { // cart.getProducts gives back array of products with zero or one product. But we only need first element.
  //   let product;
  //   if (products.length > 0) { // Checks if p. already in cart and extracts it
  //     product = products[0];
  //   }
  //   if (product) { // If there is already a p. increase qty
  //     const oldQuantity = product.cartItem.quantity; // CartItem is an object for table cartItems given by Sequelize
  //     newQuantity = oldQuantity + 1;
  //     return product;
  //   }
  //   return Product
  //     .findByPk(prodId) // If p. wasn't in cart get it from products table and returns it
  // })
  // .then(product => { // Adds either returned p. which was already in cart or returned p. which wasn't in cart to cart
  //   return fetchedCart.addProduct(product, { through: { quantity: newQuantity } }) // Magical method for n:n relations. Adds p. to carts and cartItems table and changes quantity in cartItems
  // })
  // .then(() => {
  //   res.redirect("/cart");
  // })
  // .catch(err => console.log(err));
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
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: prodId } }); // Gets wanted product
    })
    .then((products) => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

// Creating an order:
exports.postOrder = (req, res, next) => {
  let fetchedCart; // Making cart available in all blocks
  req.user
    .getCart() // Getting cart of user
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts(); // Getting products from cart
    })
    .then((products) => {
      return req.user
        .createOrder() // Creates new Order for user
        .then((order) => {
          return order.addProducts(
            products.map((product) => {
              // Sets the quantity for every product by retrieving it from cartItem
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            })
          );
        })
        .catch((err) => console.log(err));
    })
    .then((result) => {
      return fetchedCart.setProducts(null); // Deleting all products in cart by setting them to null with provided method
    })
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
