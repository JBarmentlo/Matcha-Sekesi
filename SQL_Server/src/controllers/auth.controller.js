const bcrypt   = require("bcryptjs");
const crypto   = require('crypto');
const jwt      = require("jsonwebtoken");

const sendMail = require('../services/mailgun');
const db       = require("../db/sql.conn");


exports.signup = async (req, res) => {
	console.log('Signup for user: ', req.body.username)
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
		let hash = bcrypt.hashSync(query_result.insertId.toString(), 8)
		let insert_mail_result = await db.query(
			"INSERT INTO VERIFY \
			(user, id_hash) \
			VALUES (?, ?);",
			[username, hash]
		)
		sendMail(mail, "Verify your email", "Please validate your email here: " + "http://localhost:8080/#/verify/" + encodeURIComponent(hash))
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

exports.verifyMail = async (req, res) => {
	try {
		console.log("verifying mail")
		let verify_mail_result = await db.query(
			"SELECT * FROM VERIFY \
			where id_hash=?",
			req.params.hash)
		if (verify_mail_result.length == 0) {
			res.status(200).send({message: "No user for the mail verif", code: "MISSING_VERIFY"})
			return
		}
		let delete_reset_result = await db.query(
			"DELETE FROM VERIFY \
			where id_hash=?",
			req.params.hash)
		let verify_user_result = await db.query(
			"UPDATE USERS SET mailVerified=1 WHERE USERS.username=?",
			verify_mail_result[0].user
		)
		// sendMail(mail, "Verify your email", "Please validate your email here: " + "http://localhost:8081/verify/" + encodeURIComponent(hash))
		res.status(200).send({message: "verified mail for " + verify_mail_result.user, code: "SUCCESS"})
	}
	catch (e) {
		res.status(200).send({message: "Error in verify mail", code: "Failure"})
		throw (e)
	}
};

exports.requestresetPass = async (req, res) => {
    console.log("requesting reset psw for mail %s", req.body.mail)
    // console.log("requesting reset psw for mail %s", req.body)
    
	try {
		let user_request = await db.query(
			"SELECT username, id from USERS WHERE USERS.mail=?",
			req.body.mail)

		if (user_request.length == 0) {
			console.log("MISSING: ", user_request)
			return res.status(200).send({message: "No user for the reset request", code: "MISSING_RESET"})
		}
		let user = user_request[0]
		let hash = bcrypt.hashSync(user.id.toString(), 8) 
		await db.query(
			"INSERT INTO RESET \
			(user, id_hash) \
			VALUES (?,?);",
			[user.username, hash]
		)
        sendMail(req.body.mail, "Sekesi Password Reset",  "Click here to reset password: " + "http://localhost:8080/#/reset/" + encodeURIComponent(hash))
		return res.status(200).send({message: "Sucessfully requested reset", code: "SUCCESS", hash: hash})
	}
	catch (e) {
		console.log("error in request reset")
		return res.status(400).send({message: "Error in requested reset", code: "FAILURE"})
		throw (e)
	}
};

exports.resetPass = async (req, res) => {
	try {
		console.log("resetting password")
		let verify_reset_result = await db.query(
			"SELECT * FROM RESET \
			where id_hash=?",
			req.body.hash)
		if (verify_reset_result.length == 0) {
			console.log("return res.status(201).send({message: 'No user for the reset', code: 'MISSING_VERIFY'})")
			return res.status(201).send({message: "No user for the reset", code: "MISSING_VERIFY"})
		}
		let delete_reset_result = await db.query(
			"DELETE FROM RESET \
			where id_hash=?",
			req.body.hash)
		if ((Date.now() - verify_reset_result[0].last_updated) > 600000) {
			console.log("return res.status(201).send({message: 'Code Timed out', code: 'TIMEOUT_RESET'})")
			return res.status(201).send({message: "Code Timed out", code: "TIMEOUT_RESET"})
		}
	let password_hash  = bcrypt.hashSync(req.body.password, 8);
		let verify_user_result = await db.query(
			"UPDATE USERS SET password=? WHERE USERS.username=?",
			[password_hash, verify_reset_result[0].user]
		)
		console.log("return res.status(200).send({message: 'reset pass for ' + verify_reset_result[0].user, code: 'SUCCESS'})")
		return res.status(200).send({message: "reset pass for " + verify_reset_result[0].user, code: "SUCCESS"})
	}
	catch (e) {
		console.log("error in reset Pass: ",e)
		res.status(200).send({message: "Error in reset pass", code: "Failure"})
		throw (e)
	}
};

exports.signin = async (req, res) => {
	try {
		// console.log("signing in %o", req.body)
		let user_request = await db.query(
			"SELECT * from USERS WHERE USERS.username=?",
			req.body.username
		)
		if (user_request.length == 0) {
			return res.status(201).send({message: "user doesnt exist", code: "MISSING_USERNAME"})
		}

		user = user_request[0]
		var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
		if (!passwordIsValid) {
			return res.status(201).send({ accessToken: null, message: "Invalid Password!", code: "WRONG_PASSWORD" });
		}
	
		const { privateKey, publicKey } = crypto.generateKeyPairSync('ec', {
			namedCurve: 'sect239k1'
		});
	
	
		const sign = crypto.createSign('SHA256');
		sign.write(`${user}`);
		sign.end();
		var signature = sign.sign(privateKey, 'hex');
		// console.log("signature")
		// console.log(signature)
	
		// sign username
		var token = jwt.sign({ username: user.username }, signature, {
			expiresIn: 86400 // 24 hours
		});
	
		res.status(200).send({
			user       : user,
			accessToken: token,
			signature  : signature,
			code       : "SUCCESS"
		});
	}
	catch (e) {
		console.error("ERROR in signin")
		throw (e)
	}
 
};

exports.verifyToken = (req, res, next) => {
	try {
		let token = req.headers["x-access-token"];
		let secret = req.headers["x-access-signature"];
		// console.log("TOK", token, secret)
		if (!token) {
			return res.status(403).send({ message: "No token provided!" });
		}
	
		jwt.verify(token, secret, (err, decoded) => {
			if (err) {
				return res.status(401).send({ message: "Unauthorized!" });
			}
			// console.log("Identified user %s from token", decoded.username)
			req.username = decoded.username;
			next();
		});
	}
	catch (e) {
		console.log('error in verify token')
		console.log(e)
		throw(e)
	}

};
