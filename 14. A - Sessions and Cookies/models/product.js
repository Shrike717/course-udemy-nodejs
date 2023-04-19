const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	imageUrl: {
		type: String,
		required: true,
	},
	userId: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: "User",
		required: true,
	},
});

module.exports = mongoose.model("Product", productSchema);

// const mongodb = require("mongodb");
// const { getDb } = require("../util/database");

// class Product {

//   constructor(title, price, description, imageUrl, id, userId) {
//     this.title = title;
//     this.price = price;
//     this.description = description;
//     this.imageUrl = imageUrl;
//     this._id = id ? new mongodb.ObjectId(id) : null;
//     this.userId = userId;
//   }

//   // Either saves new product or updates existing one
//   save() {
//     // Connects to our instance of DB "shop"
//     const db = getDb();
//     let dbOp; // Declares DB Operation. Stores the different opeerations in order to return it in the end.
//     // Interacts with the collecion "products".
//     // Has to  be returned to get a promise in the admin controller action
//     if (this._id) {
//       // Updates existing product
//       dbOp = db.collection("products")
//       .updateOne({ _id: this._id }, { $set: this });
//     } else {
//       // Saves new product
//       dbOp = db.collection("products")
//       .insertOne(this);
//     }
//      return dbOp.then(result => {
//         console.log(result);
//       })
//       .catch(err => console.log(err));
//   };

//   static fetchAll() {
//     const db = getDb();
//     return db.collection("products")
//     .find()
//     .toArray()
//     .then(products => {
//       console.log(products);
//       return products;
//     })
//     .catch(err => console.log(err));
//   }

//   static findById(prodId) {
//     const db = getDb();
//     return db.collection("products")
//       .findOne({_id: new mongodb.ObjectId(prodId)})
//       .then(product =>  {
//         console.log(product);
//       return product;
//       })
//       .catch(err => console.log(err));
//   };

//   static deleteById(prodId) {
//     const db = getDb();
//     return db.collection("products")
//      .deleteOne({ _id: new mongodb.ObjectId(prodId) })
//      .then(result => {
//       // console.log("Deleted!")
//      })
//      .catch(err => console.log(err));
//   };

// };

// module.exports = Product;
