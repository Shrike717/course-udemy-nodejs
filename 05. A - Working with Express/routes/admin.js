const express = require("express");

// Making use of Router Module:
const router = express.Router();

// Middleware Routes:
router.get("/add-product", (req, res, next) => {
  res.send('<form action="/product" method="POST"><input type="text" name="title"><button type="submit">Add Product</button></form>');
});

router.post("/product", (req, res, next) => {
  console.log(req.body);
  res.redirect("/");
});

module.exports = router;
