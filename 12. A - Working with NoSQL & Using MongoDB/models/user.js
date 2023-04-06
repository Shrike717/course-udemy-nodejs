const { clearCache } = require("ejs");
const mongodb = require("mongodb");
const { getDb } = require("../util/database");

const ObjectId = mongodb.ObjectId;

class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart; // Will be {items: []}
    this._id = id;
  }

  save() {
    const db = getDb();
    return db.collection("users").insertOne(this);
  }

  addToCart(product) {
    // Checks whether added product is already in cart by finding index
    const cartProductIndex = this.cart.items.findIndex(cp => {
      return cp.productId.toString() === product._id.toString(); // Strict comparison not workng with ObjectId type. Therefore converting to strings
    });
    let newQuantity = 1; // Initialize new quantity
    const updatedCartItems = [...this.cart.items]; // Copying all items from cart array to work with for updating

    if (cartProductIndex >= 0) { // If Index is anything then -1  = product exists already in cart
      newQuantity = this.cart.items[cartProductIndex].quantity + 1; // Incrementing qty on found product
      updatedCartItems[cartProductIndex].quantity = newQuantity; // Either updating qty  of existing product with incemented qty
    } else {
      updatedCartItems.push({ productId: new ObjectId(product._id), quantity: newQuantity }) // Or adding new product to cart with qty 1
    }

    const updatedCart = { items: updatedCartItems }; // Updates embedded Documemt carts in users collection

    // Saving recent cart to DB
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) })
      .then((user) => {
        console.log(user);
        return user;
      })
      .catch((err) => console.log(err));
  }
}

module.exports = User;
