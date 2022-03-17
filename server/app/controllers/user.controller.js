const { calculateObjectSize } = require("bson");
const db = require("../newmodels");
// console.log(db)
// console.log("SDF")
const user_collection = db.collection("users");
// Create and Save a new User
exports.create = (req, res) => {
	// Validate request
	// console.log("req: %s res:%s",req.body, res)
	if (!req.body.name || !req.body.mail || !req.body.username  || !req.body.firstname || !req.body.password || !req.body.profile_pic) {
	  res.status(400).send({ message: "Content can not be empty!" });
	  return;
	}

	// Create a User
	const user = {
		  username		: req.body.username,
		  mail			: req.body.mail,
		  name			: req.body.name,
		  firstname		: req.body.firstname,
		  password		: req.body.password,
		  profile_pic	: req.body.profile_pic,
	};

	// Save User in the database
	user_collection.insertOne(user)
	  .then(data => {
		res.send(data);
	  })
	  .catch(err => {
		res.status(500).send({
		  message:
			err.message || "Some error occurred while creating the User."
		});
	  });
};

checkUsernameSanity = (name) => {
	try
	{
		if (name.match("^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$").length > 0)
		{
			return true
		}
		else
		{
			console.log("Password %s invalidated (Caps, num, special)")
			return false
		}
		
	}
	catch
	{
		return false
	}
}

exports.check_username_free = (req, res) => {
	// Validate request
	// console.log("req: %s res:%s",req.body, res)
	if (!req.body.username || req.body.username.length < 5) {
		res.status(400).send({ message: "Content can not be empty or shorter than 5 characters!" });
		return;
	}

	// Save User in the database
	user_collection.findOne({username: req.body.username})
	.then(data => {
		if (data)
		{
			res.status(200).send(false)
		}
		else
		{
			res.status(200).send(true)
		}
	})
	.catch(err => {
		res.status(500).send({
			message:
			err.message || "Some error occurred while checking your username"
		});
	});
};



