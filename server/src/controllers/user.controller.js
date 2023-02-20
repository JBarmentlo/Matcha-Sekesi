const db           = require("../db/sql.conn");
var bcrypt         = require("bcryptjs");
const sendMail     = require('../services/mailgun');
const new_searches = require("./user.request.js")
const front_hostname     = require('../fixtures/hostname.js').front_hostname
const { nanoid }   = require("nanoid");


async function handle_new_mail_for_user(username, id, mail) {
	let hash = nanoid(48);
	let insert_mail_result = await db.query(
		`INSERT INTO VERIFY
		(user, id_hash, mail)
		VALUES ('${username}', '${hash}', '${mail}')`
	)
	// return Promise.resolve()
	return await sendMail(mail, "Verify your email", "Please validate your email here: " + `${front_hostname}/verify/${encodeURIComponent(hash)}`)
}


async function get_long_lat(city, postal_code) {
	try {
		let res = db.query(
			`
			SELECT * from VILLEDPOSTAL
			WHERE code_postal=?
			`,
			[postal_code]
		)
		console.log(res)
	}
	catch (e) {
		console.log(e, city, postal_code)
	}
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
		}
	}
};

async function get_long_lat(post_code) {
	try {
		let res = await db.query(
			`
			SELECT * from VILLEPOSTAL
			WHERE code_postal=?
			`,
			[post_code]
		)
		if (res.length != 0) {
			return {longitude:res[0].longitude, latitude:res[0].latitude, code_postal:res[0].code_postal, nom_comunne:res[0].nom_commune}
		}
		return null
	}
	catch (e) {
		console.log(e, post_code)
		return null
	}
}


const tolerated_keys = ['firstName', 'lastName', 'bio', 'mail', 'gender', 'sekesualOri', 'zipCode', 'city', 'image1', 'image2', 'image3', 'image0', 'profilePic', 'gif', 'DOB']

exports.update_user = async (req, res) => {
	let update = req.body.update
	Object.keys(update).forEach(key => {
		if (!tolerated_keys.includes(key) || update[key] == null || update[key] == undefined) {
			delete update[key]
		}
	});
	try {
		let location = await get_long_lat(req.body.update.zipCode)
		if (location != null && location.longitude != null) {
			console.log("Improved GPS loc: ", location)
			update.longitude = location.longitude
			update.latitude  = location.latitude
		}
		// console.log("not improving GPS cuz: ", location)
	}
	catch (e) {

		// console.log("not improving GPS", e)
	}

	console.log("update ", update)
	try {
		let update_res = await db.query(`
		UPDATE USERS
			SET   ?
			WHERE username=?
		`,
		[update, req.username])

		let del_mail = await db.query(`DELETE FROM VERIFIEDMAIL WHERE user=? AND mail != ?`,
		[req.username, update.mail])

		let del_verify = await db.query(`DELETE FROM VERIFY WHERE user=? AND mail != ?`,
		[req.username, update.mail])

		if (del_mail.affectedRows + del_verify.affectedRows) {
			console.log("Email modified")
			await handle_new_mail_for_user(req.username, update_res.insertId, update.mail)
		}
		else {
			console.log("Mail not modified")
		}

		res.status(200).send({code: "SUCCESS", data: update_res, mail_changed: del_mail.affectedRows})
	}
	catch (e) {
		console.log("update", e)
		if (e.code == "ER_DUP_ENTRY") {
			console.log("ER_DUP_ENTRY: ",e)
			return res.status(200).send({code: "MAIL_TAKEN", message: e.sqlMessage})
		}

		if (e.code == "ER_DATA_TOO_LONG") {
			console.log("ER_DATA_TOO_LONG: ",e)
			return res.status(200).send({code: "ER_DATA_TOO_LONG", message: e.sqlMessage})
		}

		if (e.code == "ER_TRUNCATED_WRONG_VALUE") {
			console.log("ER_TRUNCATED_WRONG_VALUE: ",e)
			return res.status(200).send({code: "ER_TRUNCATED_WRONG_VALUE", message: e.sqlMessage})
		}

		res.status(403).send({code: "INVALID FORM"})
	}
}


exports.get_user_by_username = async (req, res) => {
	console.log("gettin user by username")
	try {
		let user_query = await new_searches.get_user(req.username, req.params.username)
		// console.log('prof: ',user_query)
		res.status(200).send({message: 'Successfully queried user for username.', data: user_query})
	}
	catch (e) {
		console.log("get user by name error:\n", e, "\nend error")
		res.status(500).send({message: 'error in get user by username', error: e})
	}
}


exports.get_my_user = async (req, res) => {
	try {
		console.log("getting user:", req.username)
		let user_query = await new_searches.get_my_user(req.username)

		if (user_query == null) {
			return res.status(204).send({message: "No user found", code: 'FAILURE'})
		}
		res.status(200).send({message: 'Successfully queried user for username.', code: 'SUCCESS', data: user_query})
	}
	catch (e) {
		console.log("get user by name error:\n", e, "\nend error")
		res.status(500).send({message: 'error in get user by username', error: e})
	}
}