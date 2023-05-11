// Temporarily importing mongoose to provoke an error for test reasons:
const mongoose = require("mongoose");

const { validationResult } = require("express-validator");

const fileHelper = require("../util/file");

const Product = require("../models/product");

// Shows Admin Products page
exports.getProducts = (req, res, next) => {
	Product.find({ userId: req.user.id })
		// .select("title price -_id") // Utility methods to fetch only certain data fields
		// .populate("userId", "name")
		.then((products) => {
			// Path seen from views folder defined in ejs
			res.render("admin/products", {
				prods: products,
				pageTitle: "Admin Products",
				path: "/admin/products",
			});
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

// Returns Add/Edit Product form page:
exports.getAddProduct = (req, res, next) => {
	if (!req.session.isLoggedIn) {
		return res.redirect("/login");
	}
	// Path seen from views folder defined in ejs
	res.render("admin/edit-product", {
		pageTitle: "Add Product",
		path: "/admin/add-product",
		editing: false,
		hasError: false,
		errorMessage: null,
		validationErrors: [],
	});
};

// Adds a product by instanciating it from Product Model
exports.postAddProduct = (req, res, next) => {
	const title = req.body.title;
	const price = req.body.price;
	const description = req.body.description;
	const image = req.file;
	if (!image) {
		return res.status(422).render("admin/edit-product", {
			pageTitle: "Add Product",
			path: "/admin/add-product",
			editing: false,
			hasError: true,
			product: {
				// Send old input data down to view to preserve input in fields
				title: title,
				price: price,
				description: description,
			},
			errorMessage: "Attached file is not an image!",
			validationErrors: [],
		});
	}
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).render("admin/edit-product", {
			pageTitle: "Add Product",
			path: "/admin/add-product",
			editing: false,
			hasError: true,
			product: {
				// Send old input data down to view to preserve input in fields
				title: title,
				price: price,
				description: description,
			},
			errorMessage: errors.array()[0].msg,
			validationErrors: errors.array(),
		});
	}

	// Creating path to image to store path with prooduct in database:
	const imageUrl = image.path;

	const product = new Product({
		// _id: new mongoose.Types.ObjectId("644795be0c52c543dac9bb50"), // Provoked error with already existing id
		title: title,
		price: price,
		description: description,
		imageUrl: imageUrl,
		userId: req.user,
	});
	product
		.save() // Save Method automatically given by Mongoose
		.then((result) => {
			// console.log(result);
			console.log("Created Product");
			res.redirect("/admin/products");
		})
		.catch((err) => {
			// Error handling for temporary problem like invalid user input:
			// return res.status(500).render("admin/edit-product", {
			//     pageTitle: "Add Product",
			//     path: "/admin/add-product",
			//     editing: false,
			//     hasError: true,
			//     product: { // Send old input data down to view to preserve input in fields
			//         title: title,
			//         price: price,
			//         description: description,
			//         imageUrl: imageUrl,
			//     },
			//     errorMessage: "Database operation failed! Please try again",
			//     validationErrors: [],
			// });
			// Error handling for technical errors but not the best solution:
			// res.redirect("/500");
			// Better error handling using special error middlleware:
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

// Step 1: Gets product which shall be edited and returns pre-populated Edit Product page:
exports.getEditProduct = (req, res, next) => {
	// Checks for optional data in query parameters:
	// query object is automatically given by express.
	// edit is in this case the key of the key-value pair in query parameter
	const editMode = req.query.edit;

	// Getting the product id
	const prodId = req.params.productId;
	// Receiving product with this id and rendering edit product page if there is a product:

	// Gets the product and renders edit form page if there is one
	Product.findById(prodId)
		.then((product) => {
			// throw new Error(console.log("Dummy error getEditProduct")); // Test error to provoke database fail
			if (!product) {
				res.redirect("/");
			}
			// Path seen from views folder defined in ejs
			res.render("admin/edit-product", {
				pageTitle: "Edit Product",
				path: "/admin/edit-product",
				editing: editMode,
				hasError: false,
				product: product,
				errorMessage: null,
				validationErrors: [],
			});
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

// Step 2: Updating a product by click on Update button and saving it to DB:
// First saves updated values from body in post request
exports.postEditProduct = (req, res, next) => {
	const prodId = req.body.productId;
	const updatedTitle = req.body.title;
	const updatedPrice = req.body.price;
	const updatedDesc = req.body.description;
	const image = req.file;
	const errors = validationResult(req);
	console.log(errors);

	if (!errors.isEmpty()) {
		return res.status(422).render("admin/edit-product", {
			pageTitle: "Edit Product",
			path: "/admin/add-product",
			editing: true,
			hasError: true,
			product: {
				// Send old input data down to view to preserve input in fields
				title: updatedTitle,
				price: updatedPrice,
				description: updatedDesc,
				_id: prodId,
			},
			errorMessage: errors.array()[0].msg,
			validationErrors: errors.array(),
		});
	}

	// Finding product with id. Therefore updating product!
	Product.findById(prodId)
		.then((product) => {
			if (product.userId.toString() !== req.user._id.toString()) {
				// Check if user is allowed to edit this product
				return res.redirect("/");
			}
			// Mapping updated values
			product.title = updatedTitle;
			product.price = updatedPrice;
			product.description = updatedDesc;
			if (image) {
				fileHelper.deleteFile(product.imageUrl); // Param is filePath
				product.imageUrl = image.path;
			}
			return product
				.save() // Loaded product (full mongoose-object with functions) will be updated by save method.
				.then((result) => {
					console.log("Updated Product!");
					res.redirect("/admin/products");
				});
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

// Deleting a product:
exports.deleteProduct = (req, res, next) => {
	const prodId = req.params.productId; // Now extracted through async request param
	Product.findById(prodId)
		.then((product) => {
			if (!product) {
				return next(new Error("No product found!"));
			}
			fileHelper.deleteFile(product.imageUrl); // Param is filePath. Deletes image
			return Product.deleteOne({ _id: prodId, userId: req.user._id }); // Deletes prodct in DB
		})
		.then((result) => {
			Product.findById(prodId).then((product) => {
				// My check if product was deleted
				if (!product) {
					console.log("Deleted Product!");
					res.status(200).json({ // JSON Response no pagee reload
						message: "Product deleted successfully!",
					});
				}
			});
		})
		.catch((err) => {
			res.statuus(500).json({ message: "Deleting product failed!" }); // JSON Response no pagee reload
		});
};
