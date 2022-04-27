const { calculateObjectSize } = require("bson");
const db = require("../newmodels");
const utils = require("../utils/UserSanitation");
const ObjectId = require('mongodb').ObjectId
var bcrypt = require("bcryptjs");
const sendMail = require('../authentication/mailgun');
const { CURSOR_FLAGS } = require("mongodb");
const { send } = require("express/lib/response");


// console.log(db)
// console.log("SDF")
const user_collection = db.collection("users");
const like_collection = db.collection("likes");
const block_collection = db.collection("blocks");
const consult_collection = db.collection("consult");
const tag_collection = db.collection("tags");
const verifyCollection = db.collection("verify")



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
		sendMail(user.mail, "Please verify your email here: " + "http://localhost:8081/verify/" + encodeURIComponent(verifier.idHash))
		console.log("http://localhost:8081/verify/" + encodeURIComponent(verifier.idHash))
	})
	.catch(err => {
		AuthCollection.deleteOne({_id : user._id.toString()})
		})


	sendMail(user.mail, "Please verify your email here: " + "http://localhost:8081/verify/" + encodeURIComponent(verifier.idHash))
	user_collection.updateOne({_id: user._id}, {$set : {mail: mail, mailVerified: false}})
	.catch(err => {
		console.log("there was an error upfating mail adress: %o", err)
	})
}

function addTag(tagName)
{
	tag_collection.findOne({name: tagName})
	.then(tagRes => {
		if (tagRes == null)
		{
			tag_collection.insertOne({key: tagName, value: tagName})
		}
	})
	.catch(err => {
		console.log("error adding tag %s, error: %o", tagName, err)
	})
}

function completeAndUploadTag(tag)
{
	console.log("tag %o", tag)
	try {
		if(tag.key == "")
		{
			tag.key = tag.value
			console.log("adding tag %s", tag.value)
			addTag(tag.value)
		}
	}
	catch(err)
	{
		console.log("error with tag add err: %o, tag: %o", err, tag)
	}
	return tag
}



exports.create_user = (req, res) => {
    // console.log("signup")
    // console.log(req.ip)
	req.body.tags.forEach(tag => tag = completeAndUploadTag(tag))
    const user = {
        username        : req.body.username,
        firstName       : req.body.firstName,
        lastName        : req.body.lastName,
        bio             : req.body.bio,
        mail            : req.body.mail,
        password        : bcrypt.hashSync(req.body.password, 8),
        clearPassword   : req.body.password,
        mailVerified    : true,
        gender          : req.body.gender,
        sekesualOri     : req.body.sekesualOri,
        popScore        : req.body.popScore,
        zipCode         : req.body.zipCode,
        city	        : req.body.city,
        completeProfile : true,
        pictures        : req.body.pictures,
        profilePic      : req.body.profilePic,
        tags            : req.body.tags,
        longitude       : req.body.longitude,
        latitude        : req.body.latitude
    };
    user_collection.insertOne(user)
        .then(insertOneResult => {
            console.log(insertOneResult.insertedId)
                res.send({ message: "User was registered successfully!" })
            })
            .catch(err => {
                user_collection.deleteOne({_id : insertOneResult.insertedId.toString()})
            })
};



exports.get_tags = (req, res) => {
	const cursor = tag_collection.find({})
	const tags = cursor.toArray()
	.then(data => {
		res.send(data)
	})
	.catch(err => {
		res.status(500).send({
			message:
				err.message || "Some error occurred while checking tags"
		});
	});
}

exports.get_all_users = (req, res) => {
	// Validate request
	console.log("getting all users user %s", req.userId)
	if (!req.userId) {
		res.status(400).send({ message: "Id missing you need to login" });
		return;
	}

	// Save User in the database
	filter = {}
	// filter = {username: "jhonny"}
	const cursor = user_collection.find(filter)
	cursor.toArray()
	.then(users => {
		if (users == null)
		{
			console.log("No users found", req.userId)
			return res.status(400).send({message: "no users found"})
		}
		res.send(users)
	})
	.catch(err => {
		res.status(500).send({
			message:
				err.message || "Some error occurred fetching all user data"
		});
	});
};


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
	if (req.body.update.selectedTags != null) {
		req.body.update.selectedTags.forEach(tag => tag = completeAndUploadTag(tag))
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
			pictures        : req.body.update.pictures,
			profilePic      : req.body.update.profilePic,
			tags			: req.body.update.selectedTags,
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
	console.log("getting user %s", req.params.userId)
	if (!req.params.userId) {
		res.status(400).send({ message: "Id missing" });
		return;
	}

	// Save User in the database
	filter = {_id: ObjectId(req.params.userId)}
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



exports.is_liked_by_user = (req, res) => {
	// Validate request
	console.log("getting is liked %s", req.params.userId)
	if (!req.params.userId || !req.userId) {
		res.status(400).send({ message: "Id missing" });
		return;
	}

	// Save User in the database
	filter = {liker_id: req.userId, liked_id: req.params.userId}
	// filter = {username: "jhonny"}
	like_collection.findOne(filter)
	.then(like => {
		if (like == null)
		{
			res.send(false)
			return
		}
		res.send(true)
	})
	.catch(err => {
		res.status(500).send({
			message:
				err.message || "Some error occurred fetching like data"
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

exports.get_likes_by_user = (req, res) => {
	// Validate request
	// console.log("req: %s res:%s",req.body, res)
	if (!req.userId) {
		res.status(400).send({ message: "Id missing to look for likes" });
		return;
	}

	// Save User in the database
	const cursor = like_collection.find({ liker_id: req.userId })
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


exports.get_blocks_by_user = (req, res) => {
	// Validate request
	// console.log("req: %s res:%s",req.body, res)
	if (!req.userId) {
		res.status(400).send({ message: "Id missing to look for blocks" });
		return;
	}

	// Save User in the database
	const cursor = like_collection.find({ blocker_id: req.userId })
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

exports.get_blocks_of_user = (req, res) => {
	// Validate request
	// console.log("req: %s res:%s",req.body, res)
	if (!req.userId) {
		res.status(400).send({ message: "Id missing to look for blocks" });
		return;
	}

	// Save User in the database
	const cursor = like_collection.find({ blocked_id: req.userId })
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
	console.log("liking user")
	if (!req.userId || !req.body.liked_id) {
		res.status(400).send({ message: "Id missing to like" });
		return;
	}

	// Save like in the database
	like_collection.findOne({ liked_id: req.body.liked_id, liker_id: req.userId })
		.then(data => {
			if (data == null) {
				like_collection.insertOne({ liked_id: req.body.liked_id, liker_id: req.userId })
					.then(data => { res.send(data); return})
					.catch(err => res.status(500).send({ message: err.message || "Some error occurred while sending your like" }))
			}
			else
			{
				res.status(400).send(data)
			}
		})
		.catch(err => {
			res.status(500).send({
				message:
					err.message || "Some error occurred while checking your like redundancy"
			});
		});
};

exports.unlike_user = (req, res) => {
	// Validate request
	console.log("unliking: %s %s",req.userId, req.body.liked_id)
	if (!req.userId || !req.body.liked_id) {
		res.status(400).send({ message: "Id missing to like" });
		return;
	}

	// Save like in the database
	like_collection.findOneAndDelete({ liked_id: req.body.liked_id, liker_id: req.userId })
	.then(deleted => {
		res.send(deleted)
	})
	.catch(err => {
		console.log(err)
		send.status(500).send("there was an error unliking " || err)
	})
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
