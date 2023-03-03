const path = require("path");

const express = require("express");

const rootDir = require("../util/path");

// Making use of Router Module:
const router = express.Router();

const products = [];

// Middleware Routes: /admin/add-product. Watch Filter!
router.get("/add-product", (req, res, next) => {
  res.render("add-product", { pageTitle: "Add Product", path: "/admin/add-product" });
});

router.post("/add-product", (req, res, next) => {
  products.push({ title: req.body.title });
  res.redirect("/");
});

exports.routes = router;
exports.products = products;
