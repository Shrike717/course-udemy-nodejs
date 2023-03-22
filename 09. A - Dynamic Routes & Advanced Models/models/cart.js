const fs = require("fs");
const path = require("path");

// Defines path to file where we save globally
const p = path.join(path.dirname(require.main.filename), "data", "cart.json");

module.exports = class Cart {
  static addProduct(id, productPrice) {
    // Fetch previous cart from file
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      // Analyze previous cart => Find existing product Index
      const existingProductIndex = cart.products.findIndex(
        (prod) => prod.id === id
      );
      // Find product at Index
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      // Increase quantity if product is already in cart OR Add new product
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [...cart.products];
        // Updating existing product with new qty
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        // If product is new in cart
        updatedProduct = { id: id, qty: 1 };
        // Updating the products in the cart with new product
        cart.products = [...cart.products, updatedProduct];
      }
      // Updating the price of the cart
      cart.totalPrice = cart.totalPrice + +productPrice;
      // After updating or adding new product cart gets written to JSON file
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }

  // Deleting product from cart:
  static deleteProduct(id, productPrice) {
    // Fetch previous cart from file
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        return;
      }
      const updatedCart = { ...JSON.parse(fileContent) };
      // Finding product by id to get quantity in cart
      const product = updatedCart.products.find((prod) => prod.id === id);
      const productQty = product.qty;
      // Updating Array without products with wanted id
      updatedCart.products = updatedCart.products.filter(
        (prod) => prod.id !== id
      );
      // Updating total price of cart after deleting products
      updatedCart.totalPrice =
        updatedCart.totalPrice - productPrice * productQty;

      // After deleting product updated cart gets written to JSON file
      fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
        console.log(err);
      });
    });
  }

  // Getting all products from cart:
  static getCart(cb) {
    // Fetch previous cart from file
    fs.readFile(p, (err, fileContent) => {
      const cart = JSON.parse(fileContent);
      // Returns cart after fetching it.
      // If there is no cart returns null.
      if (err) {
        cb(null);
      } else {
        cb(cart);
      }
    });
  }
};
