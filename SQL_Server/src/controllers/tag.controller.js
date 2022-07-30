const db = require("../db/sql.conn");

exports.add_tag_to_user = async (req, res) => {
	// TODO this will crash with a bad request body
	let username = req.body.username
	let tag      = req.body.tag

	try {
		let tag_insert_query = await db.query(
			'INSERT INTO TAGS \
			(tag, user) \
			VALUES (?, ?)',
			[tag, username]
			)
		res.status(200).send({message: 'Succesfully added tag to user', code: "SUCCESS"})
	}
	catch (e) {
		if (e.code == 'ER_DUP_ENTRY') {
			res.status(200).send({message: "Duplicate tag", code: e.code, sqlMessage: e.sqlMessage})
		}
		else if (e.code == 'ER_DATA_TOO_LONG') {
			res.status(200).send({message: "Data too long", code: e.code, sqlMessage: e.sqlMessage})
		}
		else if (e.code == 'ER_NO_REFERENCED_ROW') {
			res.status(200).send({message: "User doesnt exist", code: e.code, sqlMessage: e.sqlMessage})
		}
		else if (e.code == 'ER_BAD_NULL_ERROR') {
			res.status(200).send({message: "User doesnt exist", code: e.code, sqlMessage: e.sqlMessage})
		}
		else if (e.code == 'ER_PARSE_ERROR') {
			res.status(500).send({message: "Parsing error when liking.", error: e, code: 'FAILURE', sqlMessage: e.sqlMessage})
			throw (e)
		}
		else {
			console.log("EROOL: ", e)
			res.status(500).send({message: "Error in like user ", error: e})
			throw(e)
		}
	}
}

exports.remove_tag_from_user = async (req, res) => {
	// TODO this will crash with a bad request body
	let username = req.body.username
	let tag      = req.body.tag

	try {
		let untag_query_result = await db.query(
			"DELETE FROM TAGS \
			WHERE user = ? and tag = ?",
			[username, tag])
		res.status(200).send({message: 'Succesfully removed tag from user', data: untag_query_result, code: "SUCCESS"})
	}
	catch (e) {
		if (e.code == 'ER_PARSE_ERROR') {
			res.status(500).send({message: "Parsing error when liking.", error: e, code: 'FAILURE'})
			throw (e)
		}
		else if (e.code == 'ER_DATA_TOO_LONG') {
			res.status(200).send({message: "Data too long", code: e.code, sqlMessage: e.sqlMessage})
		}
		else if (e.code == 'ER_NO_REFERENCED_ROW') {
			res.status(200).send({message: "User doesnt exist", code: e.code, sqlMessage: e.sqlMessage})
		}
		else if (e.code == 'ER_BAD_NULL_ERROR') {
			res.status(200).send({message: "User cant be null", code: e.code, sqlMessage: e.sqlMessage})
		}
		else {
			console.log("EROOL: ", e)
			res.status(500).send({message: "Error in like user ", error: e})
			throw(e)
		}
	}
}

exports.get_tags_from_user = async (req, res) => {
	try {
		let rows = await db.query(
			'SELECT tag \
			FROM TAGS \
			WHERE TAGS.user=?;', 
			req.body.username,)
		// console.log("ROOOS:", rows)
		// console.log("Liker: ", req.body.liker_username)
		res.status(200).send({message: 'Successfully queried users tags.', data: rows, code:'SUCCESS'})
	}
	catch (e) {
		console.log("get user tags errorr:\n", e, "\nend error")
		res.status(500).send({message: 'error in get yuser tags', error: e})
		throw(e)
	}	
}

exports.get_all_tags = async (req, res) => {
	try {
		let rows = await db.query(
			'SELECT DISTINCT tag from TAGS;'
		)
		res.status(200).send({message: 'Successfully queried all tags.', data: rows, code:'SUCCESS'})
	}
	catch (e) {
		console.log("get user tags errorr:\n", e, "\nend error")
		res.status(500).send({message: 'error in get yuser tags', error: e})
		throw(e)
	}	
}
