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
		else if (e.code == 'ER_NO_REFERENCED_ROW_2') {
			res.status(200).send({message: "User name not existing", code: e.code})
		}
		else if (e.code == 'ER_BAD_NULL_ERROR') {
			res.status(200).send({message: "User doesnt exist", code: e.code, sqlMessage: e.sqlMessage})
		}
		else if (e.code == 'ER_PARSE_ERROR') {
			res.status(500).send({message: "Parsing error when liking.", error: e, code: 'FAILURE', sqlMessage: e.sqlMessage})
		}
		else {
			console.log("EROOL: ", e)
			res.status(500).send({message: "Error in like user ", error: e})
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
return 		res.status(200).send({message: 'Succesfully removed tag from user', data: untag_query_result, code: "SUCCESS"})
	}
	catch (e) {
		if (e.code == 'ER_PARSE_ERROR') {
			return res.status(500).send({message: "Parsing error when liking.", error: e, code: 'FAILURE'})
		}
		else if (e.code == 'ER_DATA_TOO_LONG') {
			return res.status(200).send({message: "Data too long", code: e.code, sqlMessage: e.sqlMessage})
		}
		else if (e.code == 'ER_NO_REFERENCED_ROW') {
			return res.status(200).send({message: "User doesnt exist", code: e.code, sqlMessage: e.sqlMessage})
		}
		else if (e.code == 'ER_BAD_NULL_ERROR') {
			return res.status(200).send({message: "User cant be null", code: e.code, sqlMessage: e.sqlMessage})
		}
		else {
			console.log("EROOL: ", e)
			return res.status(500).send({message: "Error in like user ", error: e})
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
	}	
}

delete_all_user_tags = async (req, res) => {
	try {
		return await db.query("DELETE FROM TAGS WHERE USER = ?", req.username,)
	}
	catch (e) {
		console.log("ERROR IN DELETE ALL TAGS: ", e)
	}
}

exports.update_user_tags = async (req, res) => {
	let username = req.username
	let tag_list = req.body.tag_list

	try {
		await delete_all_user_tags(req, res)
		let keri_string ="INSERT INTO TAGS (tag, user) VALUES "
		for (const tag of tag_list) {
			keri_string += ` ('${tag}', '${username}'),`
		}
		keri_string = keri_string.slice(0, -1)
		console.log("KERI TAG: ", keri_string)
		if (tag_list.length != 0) {
			let tag_insert_query = await db.query(keri_string)
		}
		res.status(200).send({message: 'Succesfully added tag to user', code: "SUCCESS"})
	}
	catch (e) {
		if (e.code == 'ER_DUP_ENTRY') {
return 			res.status(200).send({message: "Duplicate tag", code: e.code, sqlMessage: e.sqlMessage})
		}
		else if (e.code == 'ER_DATA_TOO_LONG') {
			return res.status(200).send({message: "Data too long", code: e.code, sqlMessage: e.sqlMessage})
		}
		else if (e.code == 'ER_NO_REFERENCED_ROW') {
			return res.status(200).send({message: "User doesnt exist", code: e.code, sqlMessage: e.sqlMessage})
		}
		else if (e.code == 'ER_NO_REFERENCED_ROW_2') {
			return res.status(200).send({message: "User name not existing", code: e.code})
		}
		else if (e.code == 'ER_BAD_NULL_ERROR') {
			return res.status(200).send({message: "User doesnt exist", code: e.code, sqlMessage: e.sqlMessage})
		}
		else if (e.code == 'ER_PARSE_ERROR') {
			return res.status(500).send({message: "Parsing error when liking.", error: e, code: 'FAILURE', sqlMessage: e.sqlMessage})
		}
		else {
			console.log("EROOL: ", e)
			return res.status(500).send({message: "Error in like user ", error: e})
		}
	}
}
