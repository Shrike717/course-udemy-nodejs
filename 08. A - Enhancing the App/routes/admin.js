const path = require("path");

const express = require("express");

const productsController = require("../controllers/products");

// Making use of Router Module:
const router = express.Router();

// Middleware Routes: /admin/add-product. Watch Filter!
router.get("/add-product", productsController.getAddProduct);

router.post("/add-product", productsController.postAddProduct);

module.exports = router;
