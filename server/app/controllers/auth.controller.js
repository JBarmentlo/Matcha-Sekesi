const crypto = require('crypto');
const db = require("../newmodels");
const sendMail = require('../authentication/mailgun');
const AuthCollection = db.collection("users")
const verifyCollection = db.collection("verify")


var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
    console.log("signup")
    const user = {
        username: req.body.username,
        mail: req.body.mail,
        password: bcrypt.hashSync(req.body.password, 8),
        mailVerified: false
    };
    AuthCollection.insertOne(user)
        .then(insertOneResult => {
            console.log(insertOneResult.insertedId)
            verifier = {
                userId  : insertOneResult.insertedId,
                idHash  : bcrypt.hashSync(insertOneResult.insertedId.toString(), 8)
            }
            verifyCollection.insertOne(verifier)
            .then(insertRes => {
                // sendMail(user.mail, verifier.idHash)
                console.log(encodeURIComponent(verifier.idHash))
                res.send({ message: "User was registered successfully!" })
            })
            .catch(err => {
                AuthCollection.deleteOne({_id : insertOneResult.insertedId.toString()})
            })
        })
        .catch(err => {
            res.status(500).send({ message: err });
            return;
        })

};


exports.signin = (req, res) => {
    console.log("signing in %o", req.body)
    AuthCollection.findOne({ username: req.body.username })
        .then(user => {
            if (user == null)
            {
                res.status(400).send({message: "User doesnt exist"})
                console.log("signing in failed: no user match")
                return
            }
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


exports.verifyMail = (req, res) => {
    console.log("signing in %o", req.body)
    AuthCollection.findOne({ username: req.body.username })
        .then(user => {
            if (user == null)
            {
                res.status(400).send({message: "User doesnt exist"})
                console.log("signing in failed: no user match")
                return
            }
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