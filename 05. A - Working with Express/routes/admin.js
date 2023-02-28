const express = require("express");

// Making use of Router Module:
const router = express.Router();

// Middleware Routes: /admin/add-product. Watch Filter!
router.get("/add-product", (req, res, next) => {
  res.send('<form action="/admin/add-product" method="POST"><input type="text" name="title"><button type="submit">Add Product</button></form>');
});

router.post("/add-product", (req, res, next) => {
  console.log(req.body);
  res.redirect("/");
});

module.exports = router;
