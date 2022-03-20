const crypto = require('crypto');
const db = require("../newmodels");
const AuthCollection = db.collection("users_auth")

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
    const user = {
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    };
    AuthCollection.insertOne(user)
        .then(insertOneResult => {
            res.send({ message: "User was registered successfully!" })
        })
        .catch(err => {
            res.status(500).send({ message: err });
            return;
        })

};

exports.signin = (req, res) => {
    AuthCollection.findOne({ email: req.body.email })
        .then(user => {
            var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!"
                });
            }
            const { privateKey, publicKey } = crypto.generateKeyPairSync('ec', {
                namedCurve: 'sect239k1'
            });

            const sign = crypto.createSign('SHA256');
            sign.write(`${user}`);
            sign.end();
            var signature = sign.sign(privateKey, 'hex');
            console.log("signature")
            console.log(signature)


            // sign username
            var token = jwt.sign({ id: user.id }, signature, {
                expiresIn: 86400 // 24 hours
            });

            var authorities = [];

            res.status(200).send({
                id: user._id,
                username: user.username,
                email: user.email,
                accessToken: token, // access token
                signature: signature // signature
            });
        })
};