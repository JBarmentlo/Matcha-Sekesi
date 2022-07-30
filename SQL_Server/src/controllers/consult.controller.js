const db = require("../db/sql.conn");


exports.consult_user = async (req, res) => {
	let consulted_id = req.body.consulted_id
	let consulter_id = req.body.consulter_id

	try {
		let consult_query_result = await db.query(
			'INSERT INTO consultS \
			(consulter, consulted) \
			VALUES (?, ?)',
			[consulter_query.username, consulted_query.username]
			)
			res.status(200).send({message: 'Succesfully consulted user', code: "SUCCESS"})
			// console.log(consult_query_result)
	}
	catch (e) {
		if (e.code == 'ER_NO_REFERENCED_ROW') {
			res.status(200).send({message: "User name not existing", code: e.code})
		}
		else if (e.code == 'ER_DUP_ENTRY') {
			res.status(200).send({message: "Already consulted", code: e.code})
		}
		else if (e.code == 'ER_PARSE_ERROR') {
			res.status(500).send({message: "Parsing error when liking.", error: e, code: 'FAILURE'})
			throw (e)
		}
		else {
			console.log("EROOL: ", e)
			res.status(500).send({message: "Error in consult user ", error: e})
			throw(e)
		}
	}
}

exports.un_consult_user = async (req, res) => {
	console.log(req)
	try {
		let unconsult_query_result = await db.query(
			"DELETE FROM consultS \
			WHERE consulter = ? and consulted = ?",
			[req.body.unconsulter, req.body.unconsulted])
		res.status(200).send({message: 'Succesfully consulted user', data: unconsult_query_result, code: "SUCCESS"})
	}
	catch (e) {
		if (e.code == 'ER_PARSE_ERROR') {
			res.status(500).send({message: "Parsing error when liking.", error: e, code: 'FAILURE'})
			throw (e)
		}
		else {
			console.log("EROOL: ", e)
			res.status(500).send({message: "Error in consult user ", error: e})
			throw(e)
		}
	}
}

exports.get_users_that_i_consulted = async (req, res) => {
	try {

		let rows = await db.query(
			'SELECT * \
			FROM consultS \
			INNER JOIN USERS \
			ON consultS.consulted=USERS.username \
			WHERE consultS.consulter=?;', 
			req.body.consulter_username,)
		// console.log("ROOOS:", rows)
		// console.log("consulter: ", req.body.consulter_username)
		res.status(200).send({message: 'Successfully queried consulted users.', data: rows, code:'SUCCESS'})
	}
	catch (e) {
		if (e.code == 'ER_NO_REFERENCED_ROW') {
			console.log("NO consultS", e)
			res.status(200).send({message: "User not consulted", data:[], code: e.code})
		}
		else {
			console.log("get user by id error:\n", e, "\nend error")
			res.status(500).send({message: 'error in get user by id', error: e})
			throw(e)
		}
	}	
}


exports.get_users_that_consulted_me = async (req, res) => {
	try {

		let rows = await db.query(
			'SELECT * \
			FROM consultS \
			INNER JOIN USERS \
			ON consultS.consulter=USERS.username \
			WHERE consultS.consulted=?;', 
			req.body.consulted_username,)
		// console.log("ROOOS:", rows)
		// console.log("consulter: ", req.body.consulter_username)
		res.status(200).send({message: 'Successfully queried consulted you users.', data: rows, code:'SUCCESS'})
	}
	catch (e) {
		if (e.code == 'ER_NO_REFERENCED_ROW') {
			console.log("NO consultS", e)
			res.status(200).send({message: "nobody consults you mark", data:[], code: e.code})
		}
		else {
			console.log("get user by id error:\n", e, "\nend error")
			res.status(500).send({message: 'error in get user by id', error: e})
			throw(e)
		}
	}	
}

exports.get_consult_matches = async (req, res) => {
	try {
		let rows = await db.query(
			"SELECT r1.consulter, r1.consulted, \
				IF(( SELECT COUNT(*)  \
					FROM   consultS r2  \
					WHERE  r2.consulter = r1.consulted AND r2.consulted = r1.consulter \
				) > 0, 1, 0) AS reciprocal \
			FROM   consultS r1 \
			WHERE  r1.consulter = ?;",
			req.body.username)
		// console.log("ROOOS:", rows)
		matches = rows.filter(a =>  a.reciprocal == 1)
		matches = matches.map(function(a) {return a.consulted})
		// console.log("ROOOS:", matches)
		res.status(200).send({message: 'Successfully queried consulted you users.', data: matches, code:'SUCCESS'})
	}
	catch (e) {
		if (e.code == 'ER_NO_REFERENCED_ROW') {
			console.log("NO consultS", e)
			res.status(200).send({message: "nobody consults you mark", data:[], code: e.code})
		}
		else {
			console.log("get user by id error:\n", e, "\nend error")
			res.status(500).send({message: 'error in get user by id', error: e})
			throw(e)
		}
	}	
}