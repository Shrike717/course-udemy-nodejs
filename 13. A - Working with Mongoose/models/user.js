const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
    quantity: {
      type: Number,
      require: true,
    },
  },
});

userSchema.methods.addToCart = function (product) {
  //Checks whether added product is already in cart by finding index
  const cartProductIndex = this.cart.items.findIndex((cp) => {
    return cp.productId.toString() === product._id.toString(); // Strict comparison not workng with ObjectId type. Therefore converting to strings
  });
  let newQuantity = 1; // Initialize new quantity
  const updatedCartItems = [...this.cart.items]; // Copying all items from cart array to work with for updating

  if (cartProductIndex >= 0) {
    // If Index is anything then -1  = product exists already in cart
    newQuantity = this.cart.items[cartProductIndex].quantity + 1; // Incrementing qty on found product based  on old qty
    updatedCartItems[cartProductIndex].quantity = newQuantity; // Either updating qty of existing product with incemented qty
  } else {
    updatedCartItems.push({
      productId: product._id, // Mongoose automatcally wraps the id to an ObjectId
      quantity: newQuantity,
    }); // Or adding new product to cart with qty 1
  }

  const updatedCart = { items: updatedCartItems }; // Updates embedded Documemt carts in users collection

  // Saving recent cart to DB
  this.cart = updatedCart;
  return this.save(); // Saves with build-in method of MG.
};

userSchema.methods.removeFromCart = function(productId) {
  const updatedCartItems = this.cart.items.filter((item) => {
    // Filtering out unwanted product
    return item.productId.toString() !== productId.toString();
  });
  this.cart.items = updatedCartItems;
  return this.save(); // Saves with build-in method of MG.
}

module.exports = mongoose.model("User", userSchema);

// const { clearCache } = require("ejs");
// const mongodb = require("mongodb");
// const { getDb } = require("../util/database");

// const ObjectId = mongodb.ObjectId;

// class User {
//   constructor(username, email, cart, id) {
//     this.name = username;
//     this.email = email;
//     this.cart = cart ? cart : {}; // Safety initialization in case no cart availablle
//     this._id = id;
//     this.cart.items = cart ? cart.items : []; // Safety initialization in case no cart.items array available
//   }

//   save() {
//     const db = getDb();
//     return db.collection("users").insertOne(this);
//   }

//   addToCart(product) {
//     // Checks whether added product is already in cart by finding index
//     const cartProductIndex = this.cart.items.findIndex((cp) => {
//       return cp.productId.toString() === product._id.toString(); // Strict comparison not workng with ObjectId type. Therefore converting to strings
//     });
//     let newQuantity = 1; // Initialize new quantity
//     const updatedCartItems = [...this.cart.items]; // Copying all items from cart array to work with for updating

//     if (cartProductIndex >= 0) {
//       // If Index is anything then -1  = product exists already in cart
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1; // Incrementing qty on found product
//       updatedCartItems[cartProductIndex].quantity = newQuantity; // Either updating qty  of existing product with incemented qty
//     } else {
//       updatedCartItems.push({
//         productId: new ObjectId(product._id),
//         quantity: newQuantity,
//       }); // Or adding new product to cart with qty 1
//     }

//     const updatedCart = { items: updatedCartItems }; // Updates embedded Documemt carts in users collection

//     // Saving recent cart to DB
//     const db = getDb();
//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new ObjectId(this._id) },
//         { $set: { cart: updatedCart } }
//       );
//   }

//   getCart() {
//     const db = getDb();
//     // Creates array wth productIds from cart in user collection
//     const productIds = this.cart.items.map((i) => {
//       return i.productId;
//     });
//     return db
//       .collection("products")
//       .find({ _id: { $in: productIds } }) // Filters products by Ids from array productIds. Returns cursor
//       .toArray()
//       .then((products) => {
//         // Iterates over products and merges normal properties...
//         return products.map((p) => {
//           return {
//             ...p,
//             quantity: this.cart.items.find((i) => {
//               return i.productId.toString() === p._id.toString();
//             }).quantity, // With qty for product which is rerieved and set with anoher iteration
//           };
//         });
//       });
//   }

//   deleteItemFromCart(productId) {
//     const updatedCartItems = this.cart.items.filter((item) => {
//       // Filtering out unwanted product
//       return item.productId.toString() !== productId.toString();
//     });
//     const db = getDb();
//     return db.collection("users").updateOne(
//       // Saving updated Cart to certain user
//       { _id: new ObjectId(this._id) },
//       { $set: { cart: { items: updatedCartItems } } }
//     );
//   }

//   addOrder() {
//     const db = getDb();
//     return this.getCart() // Calling getCart to get Array with products with enriched info from cart
//       .then((products) => {
//         const order = {
//           // Creating new order with all info to  products
//           items: products,
//           user: {
//             //...and some User info in embedded document
//             _id: new ObjectId(this._id),
//             name: this.name,
//           },
//         };
//         return db
//           .collection("orders") // New collection orders
//           .insertOne(order); // Inserts above order in DB
//       })
//       .then((result) => {
//         this.cart = { items: [] }; // Empties cart user objeect in memory afterwards
//         return db.collection("users").updateOne(
//           // Saving updated Cart to certain user
//           { _id: new ObjectId(this._id) },
//           { $set: { cart: { items: [] } } }
//         ); // And empties cart also in DB afterwards
//       });
//   }

//   getOrders() { // Getting all ordeers for one certain  user
//     const db = getDb();
//     return db
//       .collection("orders")
//       .find({ "user._id": new ObjectId(this._id) }) // Filter: comparing nested User id with current user id. Returns cursor
//       .toArray();
//   }

//   static findById(userId) {
//     const db = getDb();
//     return db
//       .collection("users")
//       .findOne({ _id: new ObjectId(userId) })
//       .then((user) => {
//         console.log(user);
//         return user;
//       })
//       .catch((err) => console.log(err));
//   }
// }

// module.exports = User;
