const path = require("path");

const express = require("express");

// Making use of Router Module:
const router = express.Router();

router.get("/", (req, res, next) => {
  res.sendFile(path.join(__dirname, '../', 'views', 'shop.html'));
});

module.exports = router;
