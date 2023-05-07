const fs = require("fs");
const path = require("path");

const Product = require("../models/product");
const Order = require("../models/order");

// Calls fetchAll in model, gets the products an returns Product List Page in Index:
exports.getIndex = (req, res, next) => {
	Product.find() // Static method from Mongoose
		.then((products) => {
			// console.log(products);
			// Path seen from views folder defined in ejs
			res.render("shop/index", {
				prods: products,
				pageTitle: "Shop",
				path: "/",
			});
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
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
			});
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
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
			});
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

// Gets product by its Id through the body from post request and adds product to cart
exports.postCart = (req, res, next) => {
	const prodId = req.body.productId;
	Product.findById(prodId) // Finds product in DB
		.then((product) => {
			return req.user.addToCart(product); // Calls method in user model.Prooduct  is needed there to update cart in users
		})
		.then((result) => {
			// console.log(result);
			res.redirect("/cart");
		});
};

// Gets all products in cart and renders cart page
exports.getCart = (req, res, next) => {
	console.log(req.user);
	req.user
		.populate("cart.items.productId")
		.then((user) => {
			// console.log(user.cart.items);
			let products = user.cart.items;
			res.render("shop/cart", {
				pageTitle: "Your Cart",
				path: "/cart",
				products: products,
			});
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

// Deletes product in cart
exports.postCartDeleteProduct = (req, res, next) => {
	// First  gets product by Id in Product model
	const prodId = req.body.productId;
	req.user
		.removeFromCart(prodId)
		.then((result) => {
			res.redirect("/cart");
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

// Creating an order:
exports.postOrder = (req, res, next) => {
	req.user
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
					email: req.user.email,
					userId: req.user,
				},
			});
			return order.save();
		})
		.then((result) => {
			return req.user.clearCart();
		})
		.then(() => {
			res.redirect("/orders");
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

// Getting orders and displaying them on orders Page
exports.getOrders = (req, res, next) => {
	Order.find({ "user.userId": req.user._id })
		.then((orders) => {
			res.render("shop/orders", {
				pageTitle: "Your Orders",
				path: "/orders",
				orders: orders,
			});
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

// Middleware function to get an invoice to an order only for authenticated user
exports.getInvoice = (req, res, next) => {
	const orderId = req.params.orderId;
	//  Check that user can only see orders he created himself:
	Order.findById(orderId)
		.then((order) => {
			if (!order) {
				return next(new Error("No order found!"));
			}
			// Compares userId on order with id of logged in user
			if (order.user.userId.toString() !== req.user._id.toString()) {
				return next(new Error("Unauthorized"));
			}
			const invoiceName = "invoice-" + orderId + ".pdf";
			const invoicePath = path.join("data", "invoices", invoiceName);
			// File served ny reading. Not best practice:
			// fs.readFile(invoicePath, (err, data) => {
			// 	if (err) {
			// 		return next(err);
			// 	}
			// res.setHeader("Content-Type", "application/pdf");
			// res.setHeader(
			// 	"Content-Disposition",
			// 	'inline; filename="' + invoiceName + '"'
			// );
			// 	res.send(data);
			// });

			// File served with stream. Better:
			const file = fs.createReadStream(invoicePath);
			res.setHeader("Content-Type", "application/pdf");
			res.setHeader(
				"Content-Disposition",
				'inline; filename="' + invoiceName + '"'
			);
            file.pipe(res);
		})
		.catch((err) => {
			return next(err);
		});
};
