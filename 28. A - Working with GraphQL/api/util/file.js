const fs = require("fs");
const path = require("path");

// Helper function to delete old mage when post was pdated with a new image:
const clearImage = (filePath) => {
	// First constructing filePath to old image:
	filePath = path.join(__dirname, "..", filePath);

	// Then deleting old image:
	fs.unlink(filePath, (err) => console.log(err));
};

exports.clearImage = clearImage;
