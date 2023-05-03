// Returns 404 error Page
exports.get404 = (req, res, next) => {
	res.status(404).render("404", {
		pageTitle: "Page Not Found",
		path: "",
        isAuthenticated: req.session.isloggedIn
	});
};

// Returns 500 error Page
exports.get500 = (req, res, next) => {
	res.status(500).render("500", {
		pageTitle: "Technical error",
		path: "",
        isAuthenticated: req.session.isloggedIn
	});
};
