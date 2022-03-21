const { calculateObjectSize } = require("bson");
const db = require("../newmodels");
const utils = require("../utils/UserSanitation");
// console.log(db)
// console.log("SDF")
const user_collection = db.collection("users");
const like_collection = db.collection("likes");
const block_collection = db.collection("blocks");
const consult_collection = db.collection("consult");
const tag_collection = db.collection("tags");


// Create and Save a new User
// exports.create = (req, res) => {
// 	// Validate request
// 	// console.log("req: %s res:%s",req.body, res)
// 	if (!req.body.name || !req.body.mail || !req.body.username || !req.body.firstname || !req.body.password || !req.body.profile_pic) {
// 		res.status(400).send({ message: "Content can not be empty!" });
// 		return;
// 	}

// 	// Create a User
// 	const user = {
// 		username	:	req.body.username,
// 		mail		:	req.body.mail,
// 		name		:	req.body.name,
// 		firstname	:	req.body.firstname,
// 		password	:	req.body.password,
// 		profile_pic	:	req.body.profile_pic,
// 	};

// 	// Save User in the database
// 	user_collection.insertOne(user)
// 		.then(data => {
// 			res.send(data);
// 		})
// 		.catch(err => {
// 			res.status(500).send({
// 				message:
// 					err.message || "Some error occurred while creating the User."
// 			});
// 		});
// };


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
