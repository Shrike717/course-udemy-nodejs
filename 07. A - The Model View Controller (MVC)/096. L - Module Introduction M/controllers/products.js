const products = [];

// Returns Add Product page:
exports.getAddProduct = (req, res, next) => {
  res.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    productCSS: true,
    formsCSS: true,
    activeAddProduct: true
   });
}

// Adds a product
exports.postAddProduct = (req, res, next) => {
  products.push({ title: req.body.title });
  res.redirect("/");
}

//  Returns Product List Page in Shop:
exports.getProducts = (req, res, next) => {
  res.render("shop", {
    prods: products,
    pageTitle: "Shop",
    path: "/",
    hasProducts: products.length > 0,
    productCSS: true,
    activeShop: true,
  });
}
