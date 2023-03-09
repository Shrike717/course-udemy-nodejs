const path = require("path");

const express = require("express");

const productsController = require("../controllers/products");

// Making use of Router Module:
const router = express.Router();

router.get("/", productsController.getProducts);

module.exports = router;
