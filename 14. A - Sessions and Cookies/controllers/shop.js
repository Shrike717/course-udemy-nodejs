const Product = require("../models/product");
const Order = require("../models/order");

// Calls fetchAll in model, gets the products an returns Product List Page in Index:
exports.getIndex = (req, res, next) => {
	// const isLoggedIn = req.get("Cookie").split("=")[1].trim() === "true";
	Product.find() // Static method from Mongoose
		.then((products) => {
			// console.log(products);
			// Path seen from views folder defined in ejs
			res.render("shop/index", {
				prods: products,
				pageTitle: "Shop",
				path: "/",
				isAuthenticated: req.session.isLoggedIn,
			});
		})
		.catch((err) => {
			console.log(err);
		});
};

// Calls fetchAll in model, gets the products an returns Product List Page in Shop:
exports.getProducts = (req, res, next) => {
	Product.find()
		.then((products) => {
			// Path seen from views folder defined in ejs
			res.render("shop/product-list", {
				prods: products,
				pageTitle: "All Products",
				path: "/products",
				isAuthenticated: req.session.isLoggedIn,
			});
		})
		.catch((err) => {
			console.log(err);
		});
};

// Gets one product by its id through the URL and renders detail page:
exports.getProduct = (req, res, next) => {
	const prodId = req.params.productId;
	// findProductById is a static Mongoose method! It even can take the id as a string
	Product.findById(prodId)
		.then((product) => {
			res.render("shop/product-detail", {
				product: product,
				pageTitle: product.title,
				path: "/products",
				isAuthenticated: req.session.isLoggedIn,
			});
		})
		.catch((err) => console.log(err));
};

// Gets product by its Id through the body from post request and adds product to cart
exports.postCart = (req, res, next) => {
	const prodId = req.body.productId;
	Product.findById(prodId) // Finds product in DB
		.then((product) => {
			return req.session.user.addToCart(product); // Calls method in user model.Prooduct  is needed there to update cart in users
		})
		.then((result) => {
			// console.log(result);
			res.redirect("/cart");
		});
};

// Gets all products in cart and renders cart page
exports.getCart = (req, res, next) => {
	console.log(req.session.user);
	req.session.user
		.populate("cart.items.productId")
		.then((user) => {
			// console.log(user.cart.items);
			let products = user.cart.items;
			res.render("shop/cart", {
				pageTitle: "Your Cart",
				path: "/cart",
				products: products,
				isAuthenticated: req.session.isLoggedIn,
			});
		})
		.catch((err) => console.log(err));
};

// Deletes product in cart
exports.postCartDeleteProduct = (req, res, next) => {
	// First  gets product by Id in Product model
	const prodId = req.body.productId;
	req.session.user
		.removeFromCart(prodId)
		.then((result) => {
			res.redirect("/cart");
		})
		.catch((err) => console.log(err));
};

// Creating an order:
exports.postOrder = (req, res, next) => {
	req.session.user
		.populate("cart.items.productId")
		.then((user) => {
			console.log(user.cart.items);
			const products = user.cart.items.map((i) => {
				return {
					product: { ...i.productId._doc },
					quantity: i.quantity,
				};
			});
			const order = new Order({
				products: products,
				user: {
					name: req.session.user.name,
					userId: req.session.user,
				},
			});
			return order.save();
		})
		.then((result) => {
			return req.session.user.clearCart();
		})
		.then(() => {
			res.redirect("/orders");
		})
		.catch((err) => console.log(err));
};

// Getting orders and displaying them on orders Page
exports.getOrders = (req, res, next) => {
	Order.find({ "user.userId": req.session.user._id })
		.then((orders) => {
			res.render("shop/orders", {
				pageTitle: "Your Orders",
				path: "/orders",
				orders: orders,
				isAuthenticated: req.session.isLoggedIn,
			});
		})
		.catch((err) => console.log(err));
};
