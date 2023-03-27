const Product = require("../models/product");

// Returns Add Product page:
exports.getAddProduct = (req, res, next) => {
  // Path seen from views folder defined in ejs
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

// Adds a product by instanciating it with user input from Sequelize Model
exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;

  Product.create({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description,
  })
    .then((result) => {
      // console.log(result);
      console.log("Created product");
    })
    .catch(err => {
      console.log(err);
    });
};

// Returns Edit Product page:
exports.getEditProduct = (req, res, next) => {
  // Checks for optional data in query parameters:
  // query object is automatically given by express.
  // edit is in this case the key of the key-value pair in query parameter
  const editMode = req.query.edit;
  // Checks if editMode is false and redirects then. In this case redundant. Just to show:
  if (!editMode) {
    return res.redirect("/");
  }
  // Getting he product id
  const prodId = req.params.productId;
  // Receiving product with this id:
  Product.findById(prodId, (product) => {
    if (!product) {
      res.redirect("/");
    }
    // Path seen from views folder defined in ejs
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product: product,
    });
  });
};

// Updating a product:
exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.prodId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDesc = req.body.description;
  const updatedProduct = new Product(prodId, updatedTitle, updatedImageUrl, updatedPrice, updatedDesc);
  updatedProduct.save();
  res.redirect("/admin/products")
};

exports.getProducts = (req, res, next) => {
  Product.findAll()
  .then(products => {
    // Path seen from views folder defined in ejs
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  })
  .catch(err => {
    console.log(err);
  });
};

// Deleting a product:
exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteById(prodId);
  res.redirect("/admin/products");
};
