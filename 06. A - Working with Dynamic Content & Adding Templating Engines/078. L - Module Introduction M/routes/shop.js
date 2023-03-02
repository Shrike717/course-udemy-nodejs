const path = require("path");

const express = require("express");

const rootDir = require("../util/path");
const adminData = require("./admin");

// Making use of Router Module:
const router = express.Router();

router.get("/", (req, res, next) => {
  console.log(adminData.products);
  res.sendFile(path.join(rootDir, "views", "shop.html"));
});

module.exports = router;
