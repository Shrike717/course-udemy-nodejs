const Product = require("../models/product");

// Returns Add/Edit Product form page:
exports.getAddProduct = (req, res, next) => {
  // Path seen from views folder defined in ejs
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

// Adds a product by instanciating it from Product Model
exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.description;
  const imageUrl = req.body.imageUrl;
  const product = new Product(title, price, description, imageUrl);
  product.save()
  .then((result) => {
    // console.log(result);
    console.log("Created Product");
    res.redirect("/admin/products");
  })
  .catch(err => {
    console.log(err);
  });
};

// // Gets product which shall be edited and returns pre-populated Edit Product page:
// exports.getEditProduct = (req, res, next) => {
//   // Checks for optional data in query parameters:
//   // query object is automatically given by express.
//   // edit is in this case the key of the key-value pair in query parameter
//   const editMode = req.query.edit;

//   // Getting he product id
//   const prodId = req.params.productId;
//   // Receiving product with this id and rendering edit product page if there is a product:
//   // Product.findByPk(prodId)

//   // Gets only products of certain user to edit
//   req.user.getProducts({ where: {id: prodId} })
//     .then((products) => {
//       const product = products[0];
//       if (!product) {
//         res.redirect("/");
//       }
//       // Path seen from views folder defined in ejs
//       res.render("admin/edit-product", {
//         pageTitle: "Edit Product",
//         path: "/admin/edit-product",
//         editing: editMode,
//         product: product,
//       });
//     })
//     .catch(err => {
//       console.log(err);
//     })
// };

// // Updating a product by click on Update button and saving it to DB:
// // First saves updated values from body in post request
// exports.postEditProduct = (req, res, next) => {
//   const prodId = req.body.prodId;
//   const updatedTitle = req.body.title;
//   const updatedPrice = req.body.price;
//   const updatedImageUrl = req.body.imageUrl;
//   const updatedDesc = req.body.description;

//   //Then gets product by primary key (id) from DB and sets the new values.
//   // Then saves new product with Sequelize save metthod
//   Product.findByPk(prodId)
//     .then(product => {
//       product.title = updatedTitle,
//       product.price = updatedPrice,
//       product.imageUrl = updatedImageUrl,
//       product.description = updatedDesc
//       return product.save();
//     })
//     .then(result => {
//       console.log("Updated Product!")
//       res.redirect("/admin/products")
//     })
//     .catch(err => {
//       console.log(err);
//     })
// };

// Shows Admin Products page
exports.getProducts = (req, res, next) => {
  Product.fetchAll()
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

// // Deleting a product:
// exports.postDeleteProduct = (req, res, next) => {
//   const prodId = req.body.productId;
//   Product.findByPk(prodId)
//     .then(product => {
//       return product.destroy();
//     })
//     .then(result => {
//       console.log("Deleted Product!");
//       res.redirect("/admin/products");
//     })
//     .catch(err => {
//       console.log(err);
//     })
// };
