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
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const product = new Product(title, imageUrl, price, description);
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
