// Returns 404 error Page
exports.get404 = (req, res, next) => {
  res.status(404).render("404", {
    pageTitle: "Page Not Found",
    path: "",
    isAuthenticated: req.session.isLoggedIn,
  });
};
