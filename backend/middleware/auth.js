const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, "Pix08-45-Boulbi-94boulga");
        req.auth = { userId: decodedToken.userId };
        next();
    } catch (error) {
        res.status(401).json({ message: "Non autorisé" });
    }
};