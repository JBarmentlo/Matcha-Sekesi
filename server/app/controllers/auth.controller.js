const crypto = require('crypto');
const db = require("../newmodels");
const AuthCollection = db.collection("users")

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
    console.log("signup")
    const user = {
        username: req.body.username,
        mail: req.body.mail,
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
    AuthCollection.findOne({ mail: req.body.mail })
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
            var token = jwt.sign({ id: user._id }, signature, {
                expiresIn: 86400 // 24 hours
            });


            res.status(200).send({
                id: user._id,
                username: user.username,
                mail: user.mail,
                accessToken: token, // access token
                signature: signature // signature
            });
        })
};