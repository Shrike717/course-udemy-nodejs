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
  constructor(title) {
    this.title = title;
  }

  // Asynchronous code!
  // The passed CB function gets either empty array or aray with products from helper function above
  // Then pushes new product in this array
  // Then writes new array to products.json file.
  save() {
    getProductsFromFile(products => {
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
  }

  // Asynchronous code!
  // Is called from controller end gets CB function from there which returns roduct List Page in Shop.
  static fetchAll(cb) {
    getProductsFromFile(cb);
  }
};
