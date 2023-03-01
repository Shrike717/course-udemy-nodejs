const path = require("path");

const express = require("express");

const rootDir = require("../util/path");

// Making use of Router Module:
const router = express.Router();

// Middleware Routes: /admin/add-product. Watch Filter!
router.get("/add-product", (req, res, next) => {
  res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
});

router.post("/add-product", (req, res, next) => {
  console.log(req.body);
  res.redirect("/");
});

module.exports = router;
