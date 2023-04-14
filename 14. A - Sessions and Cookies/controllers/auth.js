// Getting and displaying them on Login Page
exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login"
  });
};
