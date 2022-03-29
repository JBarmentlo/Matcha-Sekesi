const jwt = require("jsonwebtoken");


verifyToken = (req, res, next) => {
    // console.log("VERIGY TOKEN SETTO ALWAYS TRYUUUUUEEE")
    // next()
    // return
    let token = req.headers["x-access-token"];
    let secret = req.headers["x-access-signature"];

    // console.log("verify token : %s , secret: %s", token, secret)
    if (!token) {
        return res.status(403).send({ message: "No token provided!" });
    }


    // Prints: true
    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "Unauthorized!" });
        }
        console.log("Identified user %s from token", decoded.id)
        req.userId = decoded.id;
        next();
    });
};

const authJwt = {
    verifyToken
};

module.exports = authJwt;