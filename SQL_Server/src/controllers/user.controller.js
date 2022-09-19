const db	 	= require("../db/sql.conn");
var bcrypt 		= require("bcryptjs");
const sendMail  = require('../services/mailgun');


// function check_create_user_input(req) {
// 	if (typeof())
// }

async function handle_new_mail_for_user(username, id, mail) {
	let hash = bcrypt.hashSync(id.toString(), 8)
	let insert_mail_result = await db.query(
		"INSERT INTO VERIFY \
		(user, id_hash) \
		VALUES (?, ?)",
		[username, hash]
	)
	return Promise.resolve()
	// return await sendMail(mail, "Verify your email", "Please validate your email here: " + "http://localhost:8081/verify/" + encodeURIComponent(hash))
}


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
		await handle_new_mail_for_user(username, query_result.insertId, mail)
		res.status(200).send({message: 'Succesfully created user', id: query_result.insertId, code: "SUCCESS", hash: hash})
	}
	catch (e) {
		if (e.code == 'ER_DUP_ENTRY') {
			res.status(200).send({message: e.sqlMessage, code: e.code, sqlMessage: e.sqlMessage})
		}
		else if (e.code == 'ER_PARSE_ERROR') {
			res.status(400).send({message: 'There was an error parsing your request', code: e.code, sqlMessage: e.sqlMessage})
			// throw(e)
		}
		else if (e.code == 'ER_DATA_TOO_LONG') {
			res.status(200).send({message: "Data too long", code: e.code, sqlMessage: e.sqlMessage})
		}
		else if (e.code == 'ER_BAD_NULL_ERROR') {
			res.status(200).send({message: "data columns cant be null", code: e.code, sqlMessage: e.sqlMessage})
		}
		else {
			console.log("signup error:\n", e, "\nend signup error")
			res.status(500).send({message: 'error in create test user', error: e, code: 'FAILURE'})
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
		res.status(200).send({message: 'Succesfully created user', code: 'SUCCESS', id: query_result.insertId})
	}
	catch (e) {
		if (e.code == 'ER_DUP_ENTRY') {
			res.status(200).send({message: e.sqlMessage, code: e.code, sqlMessage: e.sqlMessage})
		}
		else if (e.code == 'ER_PARSE_ERROR') {
			res.status(400).send({message: 'There was an error parsing your request', code: e.code, sqlMessage: e.sqlMessage})
			// throw(e)
		}
		else if (e.code == 'ER_DATA_TOO_LONG') {
			res.status(200).send({message: "Data too long", code: e.code, sqlMessage: e.sqlMessage})
		}
		else if (e.code == 'ER_BAD_NULL_ERROR') {
			res.status(200).send({message: "data columns cant be null", code: e.code, sqlMessage: e.sqlMessage})
		}
		else {
			console.log("signup error:\n", e, "\nend signup error")
			res.status(500).send({message: 'error in create test user', error: e, code: 'FAILURE'})
			throw(e)
		}
	}	
};


exports.update_user_test = async (req, res) => {
	// TODO: Upload tag on user creation
	// * req.body.tags.forEach(tag => tag = completeAndUploadTag(tag))

	try {
		let update_str  = ""
		let first       = true
		let update_mail = Object.keys(req.body.update).includes('mail')
		if (update_mail) {
			req.body.update.mailVerified = 0
		}
		for (const [key, value] of Object.entries(req.body.update)) {
			if (!(first==true)) {
				update_str += ', '
			}
			first = false
			update_str += `${key} = '${value}'`
		}
		console.log("Updating user %s with str: %s", req.username, update_str)
		let update_result = await db.query(
			`UPDATE USERS \
			SET ${update_str}\
			WHERE USERS.username=?;`,
			req.username)
			if (update_mail == true) {
				await handle_new_mail_for_user(req.username, update_result.insertId, req.body.update.mail)
			}
			res.status(200).send({message: "succesful update", data: update_result, code: 'SUCCESS'})
	}
	catch (e) {
		console.log("signup error:\n", e, "\nend signup error")
		res.status(500).send({message: 'error in create test user', error: e, code: 'FAILURE'})
		throw(e)

	}	

}


exports.get_user_by_id = async (req, res) => {
	try {
		let [rows, fields] = await db.query('select * from USERS where id=?', req.body.id,)
		res.status(200).send({message: 'Successfully queried user for id.', data: rows, code:'SUCCESS'})
	}
	catch (e) {
		console.log("get user by id error:\n", e, "\nend error")
		res.status(500).send({message: 'error in get user by id', error: e})
		throw(e)
	}	
}


exports.get_user_by_username = async (req, res) => {
	// TODO add groupby maybe
	try {
		let [rows, fields] = await db.query(
			"SELECT                                                                       \
				username,                                                                 \
				firstName,                                                                \
				lastName,                                                                 \
				bio,                                                                      \
				mail,                                                                     \
				password,                                                                 \
				mailVerified,                                                             \
				gender,                                                                   \
				sekesualOri,                                                              \
				popScore,                                                                 \
				zipCode,                                                                  \
				city,                                                                     \
				isCompleteProfile,                                                        \
				longitude,                                                                \
				latitude,                                                                 \
				id,                                                                       \
				GROUP_CONCAT(tag) as tag_list,                                            \
				IF((? IN(SELECT liked FROm LIKES where liker = ?)),1,0) as did_i_like_him \
			FROM USERS                                                                    \
				LEFT JOIN TAGS T                                                          \
				on USERS.username = T.user                                                \
			WHERE username=?                                                              \
			GROUP BY username;"
							  
		, req.body.username, req.username, req.body.username)
		res.status(200).send({message: 'Successfully queried user for username.', data: rows})
	}
	catch (e) {
		console.log("get user by name error:\n", e, "\nend error")
		res.status(500).send({message: 'error in get user by username', error: e})
		throw(e)
	}	
}




