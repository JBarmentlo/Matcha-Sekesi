const jwt = require("jsonwebtoken");


verifyToken = (req, res, next) => {
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
        req.userId = decoded.id;
        next();
    });
};

// isAdmin = (req, res, next) => {
//   User.findById(req.userId).exec((err, user) => {
//     if (err) {
//       res.status(500).send({ message: err });
//       return;
//     }

//     Role.find(
//       {
//         _id: { $in: user.roles }
//       },
//       (err, roles) => {
//         if (err) {
//           res.status(500).send({ message: err });
//           return;
//         }

//         for (let i = 0; i < roles.length; i++) {
//           if (roles[i].name === "admin") {
//             next();
//             return;
//           }
//         }

//         res.status(403).send({ message: "Require Admin Role!" });
//         return;
//       }
//     );
//   });
// };

const authJwt = {
    verifyToken
};

module.exports = authJwt;