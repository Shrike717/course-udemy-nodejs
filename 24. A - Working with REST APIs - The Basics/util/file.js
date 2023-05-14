const fs = require("fs");

// Util function to delete image
const deleteFile = (filePath) => {
    fs.unlink(filePath, (err) => {
        if (err) {
            throw (err);
        }
    });
};

exports.deleteFile = deleteFile;
