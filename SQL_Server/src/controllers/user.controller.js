const db	 	= require("../db/sql.conn");
var bcrypt 		= require("bcryptjs");


exports.create_user = async (req, res) => {
	let username  = req.body.username;
	let firstName = req.body.firstName;
	let lastName  = req.body.lastName;
	let mail      = req.body.mail;
	let password  = bcrypt.hashSync(req.body.password, 8);
	let zipCode   = req.body.zipCode;
	let city      = req.body.city;
	let latitude  = req.body.latitude;
	let longitude = req.body.longitude;

	try {
		let query_result = await db.query(
			'INSERT INTO USERS (username, mail, firstName, lastName, password, zipCode, longitude, latitude, city) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
			[username, mail, firstName, lastName, password, zipCode, longitude, latitude, city]
			)
		res.status(200).send({message: 'Succesfully created user', id: query_result.insertId})
	}
	catch (e) {
		if (e.code == 'ER_DUP_ENTRY') {
			res.status(200).send({message: e.sqlMessage, code: e.code})
		}
		else {
			console.log("signup error:\n", e, "\nend signup error")
			throw(e)
		}
	}	
};


exports.create_user_test = async (req, res) => {

	// TODO: Upload tag on user creation 
	// TODO: create comet user at creation
	// * req.body.tags.forEach(tag => tag = completeAndUploadTag(tag))

	username          = req.body.username
	firstName         = req.body.firstName
	lastName          = req.body.lastName
	bio               = req.body.bio
	mail              = req.body.mail
	password          = bcrypt.hashSync(req.body.password, 8),
	mailVerified      = req.body.mailVerified
	gender            = req.body.gender
	sekesualOri       = req.body.sekesualOri
	popScore          = req.body.popScore
	zipCode           = req.body.zipCode
	city              = req.body.city
	isCompleteProfile = req.body.isCompleteProfile
	longitude         = req.body.longitude
	latitude          = req.body.latitude

	try {
		let query_result = await db.query(
			'INSERT INTO USERS \
			(username, firstName, lastName, bio, mail, password, mailVerified, gender, sekesualOri, popScore, zipCode, city, isCompleteProfile, longitude, latitude) \
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
			[username, firstName, lastName, bio, mail, password, mailVerified, gender, sekesualOri, popScore, zipCode, city, isCompleteProfile, longitude, latitude]
			)
		res.status(200).send({message: 'Succesfully created user', id: query_result.insertId})
	}
	catch (e) {
		if (e.code == 'ER_DUP_ENTRY') {
			res.status(200).send({message: e.sqlMessage, code: e.code})
		}
		else {
			console.log("signup error:\n", e, "\nend signup error")
			res.status(500).send({message: e})
		}
	}	
};

exports.get_user_by_id = async (req, res) => {
	try {
		let [rows, fields] = await db.query('select * from USERS where id=?', req.body.id,)
		res.status(200).send({message: 'Successfully queried user for id.', data: rows})
	}
	catch (e) {
		if (e.code == 'ER_DUP_ENTRY') {
			res.status(200).send({message: e.sqlMessage, code: e.code})
		}
		else {
			console.log("get user by id error:\n", e, "\nend error")
			res.status(500).send({message: e})
		}
	}	
}

exports.get_user_by_username = async (req, res) => {
	try {
		let [rows, fields] = await db.query('select * from USERS WHERE username=? LIMIT 1' , req.body.username)
		res.status(200).send({message: 'Successfully queried user for username.', data: rows})
	}
	catch (e) {
		if (e.code == 'ER_DUP_ENTRY') {
			res.status(200).send({message: e.sqlMessage, code: e.code})
		}
		else {
			console.log("get user by name error:\n", e, "\nend error")
			res.status(500).send({message: e})
		}
	}	
}