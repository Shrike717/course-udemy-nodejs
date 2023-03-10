const Product = require("../models/product");

// Returns Add Product page:
exports.getAddProduct = (req, res, next) => {
  // Path seen from views folder defined in ejs
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
  });
};

// Adds a product by instanciating it with user input from class
exports.postAddProduct = (req, res, next) => {
  const product = new Product(req.body.title);
  product.save();
  res.redirect("/products");
};

exports.getProducts = (req, res, next) => {
Product.fetchAll((products) => {
  // Path seen from views folder defined in ejs
  res.render("admin/products", {
    prods: products,
    pageTitle: "Admin Products",
    path: "/admin/products"
  });
});
}
