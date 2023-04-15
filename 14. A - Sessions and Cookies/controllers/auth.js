// Getting and displaying them on Login Page
exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    isLoggedIn: req.isLoggedIn,
  });
};

// Handling post login requst
exports.postLogin = (req, res, next) => {
  req.isLoggedIn = true;
  res.redirect("/");
};
