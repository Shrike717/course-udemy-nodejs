const { getDb } = require("../util/database");

class Product {

  constructor(title, price, description, imageUrl) {
    this.title = title,
    this.price = price,
    this.description = description,
    this.imageUrl = imageUrl
  }

  save() {
    // Connects to our instance of DB "shop"
    const db = getDb();
    // Interacts with the collecion "products"
    db.collection("products").insertOne(this)
      .then(result => {
        console.log(result);
      })
      .catch(err => console.log(err));
  }
};

module.exports = Product;
