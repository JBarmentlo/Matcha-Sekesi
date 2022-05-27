const crypto = require('crypto');
const db = require("../newmodels");
const path = require('path');
const sendMail = require('../authentication/mailgun');
const user_collection = db.collection("users")
const verifyCollection = db.collection("verify")
const resetCollection = db.collection("reset")

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { createDeflate } = require('zlib');


// const default_profile_pic = "../assets/empty_profile.png"

exports.signup = (req, res) => {
    // console.log("signup")
    // console.log(req.ip)
    const user = {
        username        : req.body.username,
        firstName       : '',
        lastName        : '',
        bio             : '',
        mail            : req.body.mail,
        password        : bcrypt.hashSync(req.body.password, 8),
        mailVerified    : false,
        gender          : null,
        sekesualOri     : 'bi',
        popScore        : 1,
        zipCode         : null,
        completeProfile : false,
        pictures        : [],
        profilePic      : "",
        tags            : null,
        longitude       : null,
        latitude        : null,
        city	        : null
    };
    user_collection.insertOne(user)
        .then(insertOneResult => {
            console.log(insertOneResult.insertedId)
            verifier = {
                userId  : insertOneResult.insertedId,
                idHash  : bcrypt.hashSync(insertOneResult.insertedId.toString(), 8)
            }
            verifyCollection.insertOne(verifier)
            .then(insertRes => {
                sendMail(user.mail, "Please validate your email here: " + "http://localhost:8081/verify/" + encodeURIComponent(verifier.idHash))
                console.log("http://localhost:8081/verify/" + encodeURIComponent(verifier.idHash))
                res.send({ message: "User was registered successfully!" })
            })
            .catch(err => {
                user_collection.deleteOne({_id : insertOneResult.insertedId.toString()})
            })
        })
        .catch(err => {
            res.status(500).send({ message: err });
            return;
        })

};


exports.signin = (req, res) => {
    console.log("signing in %o", req.body)
    user_collection.findOne({ username: req.body.username })
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
    console.log("verifying mail with %o", req.params)
    verifyCollection.findOneAndDelete({idHash: req.params.idHash})
        .then(id => {
            if (id.lastErrorObject.n == 0)
            {
                res.status(400).send({message: "invalid hash code"})
                return
            }
            console.log("found id match %o", id)
            filter = {_id: id.value.userId};
            update = {$set: {mailVerified: true,},}
            user_collection.findOneAndUpdate(filter, update)
            .then(user => {
                if (user == null || user.lastErrorObject.n == 0)
                    console.log("didnt find user matching confirm, WIERD AS FUCK %o", id)
                console.log("found user match %o", user)
    
                res.send({
                    username : user.value.username,
                    mail     : user.value.mail,
                })
                console.log("sent %o", {
                    username : user.value.username,
                    mail     : user.value.mail,
                })
            })
        })
        .catch(err => {
            res.status(500).send({error: err})
        })
};



exports.requestresetPass = (req, res) => {
    console.log("requesting reset psw for mail %s", req.body.mail)
    console.log("requesting reset psw for mail %s", req.body)
    

    user_collection.findOne({mail: req.body.mail})
    .then(user => {
        if (user == null || user.verifyMail == false)
        {
            res.send()
            return
        }
        resetter = {
            userId  : user._id,
            idHash  : bcrypt.hashSync(user._id.toString(), 8),
            createdAt: new Date()
        }
        resetCollection.insertOne(resetter)
        sendMail(user.mail, "Click here to reset password: " + "http://localhost:8081/reset/" + encodeURIComponent(resetter.idHash))
        console.log("http://localhost:8081/reset/" + encodeURIComponent(resetter.idHash))
        res.send()
    })
    .catch(err => {
        console.log(err)
        res.status(500).send({error: err})
    })
};


exports.resetPass = (req, res) => {
    console.log("resetting psw for mail %s with pass %s", req.body.idHash, req.body.password)
    resetCollection.findOneAndDelete({idHash: req.body.idHash})
        .then(id => {
            if (id.lastErrorObject.n == 0)
            {
                res.status(400).send({message: "invalid hash code"})
                return
            }
            if (new Date() - id.value.createdAt > 15 * 60 * 1000)
            {
                res.status(400).send({message: "Code expired"})
                return
            }
            console.log("found id match %o", id.value)
            filter = {_id: id.value.userId};
            update = {$set: {password: bcrypt.hashSync(req.body.password, 8),},}
            user_collection.findOneAndUpdate(filter, update)
            .then(user => {
                if (user == null || user.lastErrorObject.n == 0)
                    console.log("didnt find user matching confirm, WIERD AS FUCK %o", id)
                console.log("found user match %o", user.value)
    
                res.send({
                    username : user.value.username,
                    mail     : user.value.mail,
                })
                console.log("sent %o", {
                    username : user.value.username,
                    mail     : user.value.mail,
                })
            })
        })
        .catch(err => {
            res.status(500).send({error: err})
        })
};


exports.search = (req, res) => {
	const data = req.body;
    // console.log("searching for %o", req.body)
	user_collection.find({
		popScore : { $gt : data.min_rating}
	}).toArray()
	.then(users => {
		res.status(200).send({
			message: "Profil research was succesful",
			users
		});	
	})
	.catch(err => {
		res.status(500).send({error: err})
	})
	
};
