const Product = require("../bin/product");

// Returns Add Product page:
exports.getAddProduct = (req, res, next) => {
  // Path seen from views folder defined in ejs
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    productCSS: true,
    formsCSS: true,
    activeAddProduct: true,
  });
};

// Adds a product by instanciating it with user input from class
exports.postAddProduct = (req, res, next) => {
  const product = new Product(req.body.title);
  product.save();
  res.redirect("/");
};

// Calls fetchAll in model, gets the products an returns Product List Page in Shop:
exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    // Path seen from views folder defined in ejs
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
      hasProducts: products.length > 0,
      productCSS: true,
      activeShop: true,
    });
  });
};
