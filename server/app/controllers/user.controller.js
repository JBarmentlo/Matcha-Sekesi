const { calculateObjectSize } = require("bson");
const db = require("../newmodels");
const utils = require("../utils/UserSanitation");
const ObjectId = require('mongodb').ObjectId
var bcrypt = require("bcryptjs");
const sendMail = require('../authentication/mailgun');


// console.log(db)
// console.log("SDF")
const user_collection = db.collection("users");
const like_collection = db.collection("likes");
const block_collection = db.collection("blocks");
const consult_collection = db.collection("consult");
const tag_collection = db.collection("tags");
const verifyCollection = db.collection("verify")



const userProjection = {
    "_id": "623b31a19b2caf381d333cfb",
    "username": "jhonny",
    "mail": "joepbarmentlo@gmail.com",
    "password": "$2a$08$yObMlN/HYglguF4ta3S0NO6giu9/ARd.c/g9jDIqSH4u7y9/6yEzG",
    "mailVerified": true,
    "gender": null,
    "sekesualOri": "bi",
    "popScore": 0,
    "zipCode": null,
    "completeProfile": false
}

function isUserProfileComplete(user)
{
	return true;
}

async function changeMail(user, mail)
{
	if (user.mail == mail)
		return

	console.log("updating mail address %s %s", user.mail, mail)
	verifier = {
		userId  : user._id,
		idHash  : bcrypt.hashSync(user._id.toString(), 8)
	}
	verifyCollection.insertOne(verifier)
	.then(insertRes => {
		sendMail(user.mail, "http://localhost:8081/verify/" + encodeURIComponent(verifier.idHash))
		console.log("http://localhost:8081/verify/" + encodeURIComponent(verifier.idHash))
	})
	.catch(err => {
		AuthCollection.deleteOne({_id : user._id.toString()})
		})


	sendMail(user.mail, "http://localhost:8081/verify/" + encodeURIComponent(verifier.idHash))
	user_collection.updateOne({_id: user._id}, {$set : {mail: mail, mailVerified: false}})
	.catch(err => {
		console.log("there was an error upfating mail adress: %o", err)
	})
}

exports.get_my_user = (req, res) => {
	// Validate request
	console.log("getting user %s", req.userId)
	if (!req.userId) {
		res.status(400).send({ message: "Id missing you need to login" });
	return;
	}

	// Save User in the database
	filter = {_id: ObjectId(req.userId)}
	// filter = {username: "jhonny"}
	user_collection.findOne(filter)
	.then(user => {
		if (user == null)
		{
			console.log("No user found for ID in token %s", req.userId)
			return res.status(400).send({message: "no user found"})
		}
		res.send(user)
	})
	.catch(err => {
		res.status(500).send({
			message:
				err.message || "Some error occurred fetching user data"
		});
	});
};

exports.update_user = (req, res) => {
	// Validate request
	console.log("updating user %s", req.userId)
	console.log("with %s", req.body.update)
	if (!req.userId) {
		res.status(400).send({ message: "Id missing you need to login" });
	return;
	}

	filter = {_id: ObjectId(req.userId)}
	completed = isUserProfileComplete(req.body.update)
	update = {
		$set : {
			lastName		: req.body.update.lastName,
			firstName		: req.body.update.firstName,
			mail			: req.body.update.mail,
			bio				: req.body.update.bio,
			gender			: req.body.update.gender,
			sekesualOri		: req.body.update.sekesualOri,
			zipCode			: req.body.update.zipCode,
			completeProfile	: completed,
		}
	}
	user_collection.findOne(filter)
	.then(user => {
		console.log("found user to update %o", user)
		if (user == null)
		{
			console.log("No user found for ID in token %s", req.userId)
			return res.status(400).send({message: "no user found"})
		}
		changeMail(user, req.body.update.mail)
		.catch(er => {console.log(err)})
		user_collection.updateOne(filter, update)
		.then(res.send(user))
		.catch(err => {
			console.log("error in update")
			res.status(500).send({
				message:
					err.message || "Some error occurred updating user data"
			});
		})
	})
	.catch(err => {
		res.status(500).send({
			message:
				err.message || "Some error occurred fetching user data"
		});
		console.log("error in find one to update" + err.message)
	});
};

exports.get_user_by_id = (req, res) => {
	// Validate request
	console.log("getting user %s", req.body.userId)
	if (!req.body.userId) {
		res.status(400).send({ message: "Id missing" });
	return;
	}

	// Save User in the database
	filter = {_id: ObjectId(req.body.userId)}
	// filter = {username: "jhonny"}
	user_collection.findOne(filter)
	.then(user => {
		if (user == null)
		{
			res.status(400).send({message: "no user found"})
			return
		}
		delete user.password
		delete user.mail
		res.send(user)
	})
	.catch(err => {
		res.status(500).send({
			message:
				err.message || "Some error occurred fetching user data"
		});
	});
};


exports.get_likes_of_user = (req, res) => {
	// Validate request
	// console.log("req: %s res:%s",req.body, res)
	if (!req.userId) {
		res.status(400).send({ message: "Id missing to look for likes" });
		return;
	}

	// Save User in the database
	const cursor = like_collection.find({ liked_id: req.userId })
	const likers = cursor.toArray()
		.then(data => {
			res.status(200).send(data)
		})
		.catch(err => {
			res.status(500).send({
				message:
					err.message || "Some error occurred while checking your likes"
			});
		});
};

exports.get_consults_of_user = (req, res) => {
	// Validate request
	// console.log("req: %s res:%s",req.body, res)
	if (!req.userId) {
		res.status(400).send({ message: "Id missing to look for consults" });
		return;
	}

	// Save User in the database
	const cursor = like_collection.find({ consulted_id: req.userId })
	const likers = cursor.toArray()
		.then(data => {
			res.status(200).send(data)
		})
		.catch(err => {
			res.status(500).send({
				message:
					err.message || "Some error occurred while checking your consulters"
			});
		});
};

exports.get_blocks_of_and_by_user = (req, res) => {
	// Validate request
	// console.log("req: %s res:%s",req.body, res)
	if (!req.userId) {
		res.status(400).send({ message: "Id missing to look for blocks" });
		return;
	}

	// Save User in the database
	const cursor = like_collection.find({
		$or: [
			{ blocked_id: req.userId },
			{ blocker_id: req.userId },
		]
	})
	const likers = cursor.toArray()
		.then(data => {
			res.status(200).send(data)
		})
		.catch(err => {
			res.status(500).send({
				message:
					err.message || "Some error occurred while checking your blocks"
			});
		});
};


exports.like_user = (req, res) => {
	// Validate request
	console.log("req: %s res:%s",req.body, res)
	if (!req.userId || !req.body.liked_id) {
		res.status(400).send({ message: "Id missing to like" });
		return;
	}

	// Save User in the database
	like_collection.findOne({ liked_id: req.body.liked_id, liker_id: req.userId })
		.then(data => {
			if (data == null) {
				like_collection.insertOne({ liked_id: req.body.liked_id, liker_id: req.userId })
					.then(data => { res.send(data) })
					.catch(err => res.status(500).send({ message: err.message || "Some error occurred while sending your like" }))
			}
		})
		.catch(err => {
			res.status(500).send({
				message:
					err.message || "Some error occurred while checking your like redundancy"
			});
		});
};

exports.block_user = (req, res) => {
	// Validate request
	// console.log("req: %s res:%s",req.body, res)
	if (!req.userId || !req.body.blocked_id) {
		res.status(400).send({ message: "Id missing to block" });
		return;
	}

	// Save User in the database
	block_collection.findOne({ blocked_id: req.body.blocked_id, blocker_id: req.userId })
		.then(data => {
			if (data == null) {
				block_collection.insertOne({ blocked_id: req.body.blocked_id, blocker_id: req.userId })
					.then(data => { res.send(data) })
					.catch(err => res.status(500).send({ message: err.message || "Some error occurred while sending your block" }))
			}
		})
		.catch(err => {
			res.status(500).send({
				message:
					err.message || "Some error occurred while checking your block redundancy"
			});
		});
};

exports.consult_user = (req, res) => {
	// Validate request
	// console.log("req: %s res:%s",req.body, res)
	if (!req.userId || !req.body.consulted_id) {
		res.status(400).send({ message: "Id missing to consult" });
		return;
	}

	// Save User in the database
	consult_collection.findOne({ consulted_id: req.body.consulted_id, consulter_id: req.userId })
		.then(data => {
			if (data == null) {
				consult_collection.insertOne({ consulted_id: req.body.consulted_id, consulter_id: req.userId })
					.then(data => { res.send(data) })
					.catch(err => res.status(500).send({ message: err.message || "Some error occurred while sending your consult" }))
			}
		})
		.catch(err => {
			res.status(500).send({
				message:
					err.message || "Some error occurred while checking your consult redundancy"
			});
		});
};
