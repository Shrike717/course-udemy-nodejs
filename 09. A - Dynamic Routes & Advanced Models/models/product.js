const fs = require("fs");
const path = require("path");

// Defines path to file where we save globally
const p = path.join(
  path.dirname(require.main.filename),
  "data",
  "products.json"
);

// Helper function to read save file.
// Returns empty array in case there is no file
// Otherwise returns array with products in it
const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  // Creates product object in instances
  constructor(id, title, imageUrl, price, description) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  // Asynchronous code!
  // The passed CB function gets either empty array or aray with products from helper function above
  // Then checks for an existing id when save() getts callled from controller.
  // If it finds one, the if block with the update loogic is executed.
  // If not (id === nulll), the else block is executed to add new product
  // It then pushes new product in this array
  // Then writes new array to products.json file.
  save() {
    getProductsFromFile((products) => {
      if (this.id) {
        const existingProductIndex = products.findIndex(
          (prod) => prod.id === this.id
        );
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;
        fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
          console.log(err);
        });
      } else {
        this.id = Math.random().toString();
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), (err) => {
          console.log(err);
        });
      }
    });
  }

   // Asynchronous code!
   // Updates products Array by forwarding all products withot the one with the incoming id.
  static deleteById(id) {
    getProductsFromFile((products) => {
      const updatedProducts = products.filter((prod) => prod.id !== id);
      fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
        if (!err) {

        }
      });
    });
  }

  // Asynchronous code!
  // Is called from controller end gets CB function from there which returns Product List Page in Shop.
  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  // Asynchronous code!
  // Gets one product by its id:
  static findById(id, cb) {
    getProductsFromFile((products) => {
      const product = products.find((p) => p.id === id);
      cb(product);
    });
  }
};
