const jwt = require("jsonwebtoken");

function auth(req, res, next) {

    console.log("==== AUTH ====");
    console.log("Authorization:", req.headers.authorization);

    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({
            message: "No token provided"
        });
    }

    try {

        const decoded = jwt.verify(token, "maliflow_secret");

        console.log("Decoded user:", decoded);

        req.user = decoded;

        next();

    } catch (error) {

        console.log("JWT Error:", error.message);

        return res.status(401).json({
            message: "Invalid token"
        });
    }
}

module.exports = auth;