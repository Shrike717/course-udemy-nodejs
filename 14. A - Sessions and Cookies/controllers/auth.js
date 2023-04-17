// Getting and displaying them on Login Page
exports.getLogin = (req, res, next) => {
  const isLoggedIn = req.get("Cookie").split("=")[1].trim();
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    isAuthenticated: isLoggedIn,
  });
};

// Handling post login requst
exports.postLogin = (req, res, next) => {
  res.setHeader("Set-Cookie", "loggedIn=true");
  res.redirect("/");
};
