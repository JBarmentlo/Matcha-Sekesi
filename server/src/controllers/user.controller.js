const db       = require("../db/sql.conn");
var bcrypt     = require("bcryptjs");
const sendMail = require('../services/mailgun');
const searches = require("./user.request.js")
const tagController = require("./tag.controller")


// function check_create_user_input(req) {
// 	if (typeof())
// }
const hostname=`${process.env.MATCHA_HOST}${process.env.MATCHA_DEFAULT_PORT == '80' || process.env.MATCHA_DEFAULT_PORT == '443' ? '' : ':' + process.env.MATCHA_DEFAULT_PORT}`



async function handle_new_mail_for_user(username, id, mail) {
	let hash = bcrypt.hashSync(id.toString(), 8)
	let insert_mail_result = await db.query(
		"INSERT INTO VERIFY \
		(user, id_hash) \
		VALUES (?, ?)",
		[username, hash]
	)
	// return Promise.resolve()
	return await sendMail(mail, "Verify your email", "Please validate your email here: " + `${hostname}/verify/${encodeURIComponent(hash)}`)
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
			// // throw(e)
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
			// throw(e)
		}
	}	
};

const tolerated_keys = ['username', 'firstName', 'lastName', 'bio', 'mail', 'mailVerified', 'gender', 'sekesualOri', 'popScore', 'zipCode', 'city', 'image1', 'image2', 'image3', 'image0', 'profilePic', 'gif', 'DOB']



exports.update_user_test = async (req, res) => {
	try {
		let update_str  = ""
		let first       = true
		let update_mail = Object.keys(req.body.update).includes('mail')
		if (update_mail) {
			req.body.update.mailVerified = 0
		}
		for (const [key, value] of Object.entries(req.body.update)) {
			if (tolerated_keys.includes(key)) {
				if (!(first==true)) {
					update_str += ', '
				}
				first = false
				update_str += `${key} = '${value}'`
			}
		}
		update_str = update_str.replace("'null'", "NULL")
		console.log("Updating user %s with str: %s", req.username, update_str)
		let update_result
		if (update_str.length != 0) {
			update_result = await db.query(
				`UPDATE USERS \
				SET ${update_str}\
				WHERE USERS.username=?;`,
				req.username)
				if (update_mail == true) {
					await handle_new_mail_for_user(req.username, update_result.insertId, req.body.update.mail)
				}
		}
		else {
			update_result = {}
		}
		res.status(200).send({message: "succesful update", data: update_result, code: 'SUCCESS'})
	}
	catch (e) {
		// TODO ER_BAD_FIELD_ERROR
		console.log("update user error:\n", e, "\nend update user error")
		res.status(500).send({message: 'error in update test user', error: e, code: 'FAILURE'})
		// throw(e)

	}	

}


exports.get_user_by_username = async (req, res) => {
	console.log("gettin user by username")
	try {
		let user_query = await searches.get_user(req.username, req.params.username)
		// console.log('prof: ',user_query)
		res.status(200).send({message: 'Successfully queried user for username.', data: user_query})
	}
	catch (e) {
		console.log("get user by name error:\n", e, "\nend error")
		res.status(500).send({message: 'error in get user by username', error: e})
		// throw(e)
	}	
}


exports.get_my_user = async (req, res) => {
	try {
		console.log("getting user:", req.username)
		let user_query = await searches.get_my_user(req.username)
		console.log("USERSE: ", user_query)
		if (user_query == undefined) {
			return res.status(204).send({message: "No user found", code: 'FAILURE'})
		}
		res.status(200).send({message: 'Successfully queried user for username.', code: 'SUCCESS', data: user_query})
	}
	catch (e) {
		console.log("get user by name error:\n", e, "\nend error")
		res.status(500).send({message: 'error in get user by username', error: e})
		// throw(e)
	}
}