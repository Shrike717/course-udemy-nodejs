// Getting and displaying them on Login Page
exports.getLogin = (req, res, next) => {
  console.log(req.get("Cookie"));
  const isLoggedIn = req.get("Cookie").split("=")[1].trim() === "true";  // Check Network tab Request Header for Cookie name
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    isAuthenticated: isLoggedIn,
  });
};

// Handling post login requst
exports.postLogin = (req, res, next) => {
  res.setHeader("Set-Cookie", "loggedIn=true; HttpOnly");
  res.redirect("/");
};
