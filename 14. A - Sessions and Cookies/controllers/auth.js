// Getting and displaying them on Login Page
exports.getLogin = (req, res, next) => {
  // console.log(req.get("Cookie"));
  // const isLoggedIn = req.get("Cookie").split("=")[1].trim() === "true";  // Check Network tab Request Header for Cookie name
  console.log(req.session.isLoggedIn);
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    isAuthenticated: false,
  });
};

// Handling post login requst
exports.postLogin = (req, res, next) => {
  req.session.isLoggedIn = true;
  res.redirect("/");
};
