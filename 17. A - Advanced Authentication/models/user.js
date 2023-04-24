const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	resetToken: { type: String },
	resetTokenExpiration: { type: Date },
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

userSchema.methods.removeFromCart = function (productId) {
	const updatedCartItems = this.cart.items.filter((item) => {
		// Filtering out unwanted product
		return item.productId.toString() !== productId.toString();
	});
	this.cart.items = updatedCartItems;
	return this.save(); // Saves with build-in method of MG.
};

userSchema.methods.clearCart = function () {
	this.cart = { items: [] };
	return this.save();
};

module.exports = mongoose.model("User", userSchema);
