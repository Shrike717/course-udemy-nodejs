const jwt = require("jsonwebtoken");
require("dotenv").config();

// Middlewae to check for existence AND validation of incoming JWT token:
module.exports = (req, res, next) => {
    // Checks if Authorization Header was provided with request:
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        const error = new Error("No Authorization Header found!");
        error.statusCode = 401; // 401 = Not autheticated
        throw error;
    }
    const token = authHeader.split(" ")[1]; // Extracting JWT token

    // Then decoding the token:
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Checks if token is existent AND valid
    } catch (error) {
        error.statusCode = 500;
        throw error;
    }
    // Check if package was unable to verify decoded Token:
    if (!decodedToken) {
        const error = new Error("Not authenticated!");
        error.statusCode = 401; // 401 = Not autheticated
        throw error;
    }
    // Now we know we have a decoded and verified Token:
    req.userId = decodedToken.userId; // Important to allow user to interact with owned posts later
    next();
};
