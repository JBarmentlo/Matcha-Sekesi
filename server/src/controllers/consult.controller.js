const db              = require("../db/sql.conn");
const NotifController = require('./notif.controller')


// async function update_consult_timestamp()
exports.consult_user_old = async (req, res) => {
	console.log("consulting ", req.body.consulted)
	try {
		let consult_query_result = await db.query(
			'REPLACE INTO CONSULTS \
			(consulter, consulted) \
			VALUES (?, ?)',
			[req.username, req.body.consulted]
			)
		let notres = await NotifController.create_notif("CONSULT", req.username, req.body.consulted)
		return res.status(200).send({message: 'Succesfully consulted user', code: "SUCCESS"})
	}
	catch (e) {
		if (e.code == 'ER_NO_REFERENCED_ROW') {
			return res.status(200).send({message: "User name not existing", code: e.code})
		}
		else if (e.code == 'ER_NO_REFERENCED_ROW_2') {
			res.status(200).send({message: "User name not existing", code: e.code})
		}
		else if (e.code == 'ER_DUP_ENTRY') {
			return res.status(200).send({message: "Already Liked", code: e.code})
		}
		else if (e.code == 'ER_PARSE_ERROR') {
			return res.status(500).send({message: "Parsing error when liking.", error: e, code: 'FAILURE'})
			throw (e)
		}
		else {
			console.log("EROOL: ", e)
			return res.status(500).send({message: "Error in consult user ", error: e})
			throw(e)
		}
	}
}

exports.consult_user = async (req, res) => {
	console.log("consulting ", req.params.username)
	try {
		let consult_query_result = await db.query(
			'REPLACE INTO CONSULTS \
			(consulter, consulted) \
			VALUES (?, ?)',
			[req.username, req.params.username]
			)
		let notres = await NotifController.create_notif("CONSULT", req.username, req.params.username)
		// console.log("consulting res ", consult_query_result)
		// console.log("notifres: ", notres )
		return res.status(200).send({message: 'Succesfully consulted user', code: "SUCCESS"})
	}
	catch (e) {
		if (e.code == 'ER_NO_REFERENCED_ROW') {
			return res.status(200).send({message: "User name not existing", code: e.code})
		}
		else if (e.code == 'ER_NO_REFERENCED_ROW_2') {
			res.status(200).send({message: "User name not existing", code: e.code})
		}
		else if (e.code == 'ER_DUP_ENTRY') {
			return res.status(200).send({message: "Already Liked", code: e.code})
		}
		else if (e.code == 'ER_PARSE_ERROR') {
			return res.status(500).send({message: "Parsing error when liking.", error: e, code: 'FAILURE'})
			throw (e)
		}
		else {
			console.log("EROOL: ", e)
			return res.status(500).send({message: "Error in consult user ", error: e})
			throw(e)
		}
	}
}



exports.get_users_that_i_consulted = async (req, res) => {
	try {

		let rows = await db.query(
			"SELECT * \
			FROM CONSULTS \
			INNER JOIN USERS \
			ON CONSULTS.consulted=USERS.username \
			WHERE CONSULTS.consulter=? AND \
			NOT EXISTS (SELECT 1 FROM BLOCKS  \
				WHERE CONSULTS.consulter = BLOCKS.blocked AND CONSULTS.consulted = BLOCKS.blocker OR \
				CONSULTS.consulter = BLOCKS.blocker AND CONSULTS.consulted = BLOCKS.blocked);", 
			req.username,)
		// console.log("ROOOS:", rows)
		// console.log("consulter: ", req.body.consulter_username)
		return res.status(200).send({message: 'Successfully queried consulted users.', data: rows, code:'SUCCESS'})
	}
	catch (e) {
		if (e.code == 'ER_NO_REFERENCED_ROW') {
			console.log("NO CONSULTS", e)
			return res.status(200).send({message: "User not consulted", data:[], code: e.code})
		}
		else {
			console.log("get user by id error:\n", e, "\nend error")
			return res.status(500).send({message: 'error in get user by id', error: e})
			throw(e)
		}
	}	
}


exports.get_users_that_consulted_me = async (req, res) => {
	try {

		let rows = await db.query(
			'SELECT * \
			FROM CONSULTS \
			INNER JOIN USERS \
			ON CONSULTS.consulter=USERS.username \
			WHERE CONSULTS.consulted=? AND \
			NOT EXISTS (SELECT 1 FROM BLOCKS  \
				WHERE CONSULTS.consulter = BLOCKS.blocked AND CONSULTS.consulted = BLOCKS.blocker OR \
				CONSULTS.consulter = BLOCKS.blocker AND CONSULTS.consulted = BLOCKS.blocked);', 
			req.username,)
		// console.log("ROOOS:", rows)
		// console.log("consulter: ", req.body.consulter_username)
		return res.status(200).send({message: 'Successfully queried consulted you users.', data: rows, code:'SUCCESS'})
	}
	catch (e) {
		if (e.code == 'ER_NO_REFERENCED_ROW') {
			console.log("NO CONSULTS", e)
			return res.status(200).send({message: "nobody CONSULTS you mark", data:[], code: e.code})
		}
		else {
			console.log("get user by id error:\n", e, "\nend error")
			return res.status(500).send({message: 'error in get user by id', error: e})
			throw(e)
		}
	}	
}

exports.get_consult_matches = async (req, res) => {
	try {
		let rows = await db.query(
			"SELECT r1.consulter, r1.consulted, \
				IF(( SELECT COUNT(*)  \
					FROM   CONSULTS r2  \
					WHERE  r2.consulter = r1.consulted AND r2.consulted = r1.consulter \
				) > 0, 1, 0) AS reciprocal \
			FROM   CONSULTS r1 \
			WHERE  r1.consulter = ?;",
			req.username)
		// console.log("ROOOS:", rows)
		matches = rows.filter(a =>  a.reciprocal == 1)
		matches = matches.map(function(a) {return a.consulted})
		// console.log("ROOOS:", matches)
		res.status(200).send({message: 'Successfully queried consulted you users.', data: matches, code:'SUCCESS'})
	}
	catch (e) {
		if (e.code == 'ER_NO_REFERENCED_ROW') {
			console.log("NO CONSULTS", e)
			res.status(200).send({message: "nobody CONSULTS you mark", data:[], code: e.code})
		}
		else {
			console.log("get user by id error:\n", e, "\nend error")
			res.status(500).send({message: 'error in get user by id', error: e})
			throw(e)
		}
	}	
}