const path = require("path");

const express = require("express");

const rootDir = require("../util/path");

// Making use of Router Module:
const router = express.Router();

const products = [];

// Middleware Routes: /admin/add-product. Watch Filter!
router.get("/add-product", (req, res, next) => {
  res.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    productCSS: true,
    formsCSS: true,
    activeAddProduct: true
   });
});

router.post("/add-product", (req, res, next) => {
  products.push({ title: req.body.title });
  res.redirect("/");
  //console.log(products);
});
//console.log("runtime");
//console.log(products);

exports.routes = router;
exports.products = products;
