const path = require("path");
const { check, body } = require("express-validator");

const express = require("express");

const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");

// Making use of Router Module:
const router = express.Router();

// Routes trigger Middleware functions in controller:
// /admin/add-product => GET
router.get("/add-product", isAuth, adminController.getAddProduct);

// /admin/products => GET
router.get("/products", isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post(
	"/add-product",
	[
		body("title", "Please enter a title with at least 3 character.").trim().isString().isLength({ min: 3 }),
		body("price", "Please enter a price.").trim().isFloat(),
		body("description", "Please enter a description with at least 5 characters.").trim().isLength({ min: 5, max: 400 }),
	],
	isAuth,
	adminController.postAddProduct
);

// /admin/edit-product/:id => GET
router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

// /admin/edit-product => POST
router.post(
	"/edit-product",
	[
        body("title", "Please enter a title with at least 3 character.").trim().isString().isLength({ min: 3 }),
		body("imageUrl", "Please enter an image Url.").trim().isURL(),
		body("price", "Please enter a price.").trim().isFloat(),
		body("description", "Please enter a description with at least 5 characters.").trim().isLength({ min: 5, max: 400 }),
	],
	isAuth,
	adminController.postEditProduct
);

// /admin/delete-product => POST
router.post("/delete-product", isAuth, adminController.postDeleteProduct);

module.exports = router;
