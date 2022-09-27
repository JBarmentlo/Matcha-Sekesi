const db = require("../db/sql.conn");


exports.block_user_by_id = async (req, res) => {
	let blocked_id = req.body.blocked_id
	let blocker_id = req.body.blocker_id


	let [blocked_query, ] = await db.query('select * from USERS where id=?', blocked_id)
	let [blocker_query, ] = await db.query('select * from USERS where id=?', blocker_id)
	try {
		if (typeof blocked_query !== 'undefined' && blocked_query !== null && typeof blocker_query !== 'undefined' && blocker_query !== null){
			let block_query_result = await db.query(
				'INSERT INTO BLOCKS \
				(blocker, blocked) \
				VALUES (?, ?)',
				[blocker_query.username, blocked_query.username]
				)
			res.status(200).send({message: 'Succesfully blocked user', code: "SUCCESS"})
			// console.log(block_query_result)
		}
		else {
			res.status(200).send({message: "One of the users does not exist", code:"block_MISS"})
		}
	}
	catch (e) {
		if (e.code == 'ER_NO_REFERENCED_ROW') {
			res.status(200).send({message: "User name not existing", code: e.code})
		}
		else if (e.code == 'ER_DUP_ENTRY') {
			res.status(200).send({message: "Already blocked", code: e.code})
		}
		else if (e.code == 'ER_PARSE_ERROR') {
			res.status(500).send({message: "Parsing error when liking.", error: e, code: 'FAILURE'})
			throw (e)
		}
		else {
			console.log("EROOL: ", e)
			res.status(500).send({message: "Error in block user ", error: e})
			throw(e)
		}
	}
}

exports.block_user = async (req, res) => {
	// console.log('blocking ', req.username, req.body.blocked)
	try {
		let block_query_result = await db.query(
			'INSERT INTO BLOCKS \
			(blocker, blocked) \
			VALUES (?, ?)',
			[req.username, req.body.blocked]
			)
		res.status(200).send({message: 'Succesfully blocked user', code: "SUCCESS"})
	}
	catch (e) {
		if (e.code == 'ER_NO_REFERENCED_ROW') {
			res.status(200).send({message: "User name not existing", code: e.code})
		}
		else if (e.code == 'ER_DUP_ENTRY') {
			res.status(200).send({message: "Already blocked", code: e.code})
		}
		else if (e.code == 'ER_NO_REFERENCED_ROW_2') {
			res.status(200).send({message: "User name not existing", code: e.code})
		}
		else if (e.code == 'ER_PARSE_ERROR') {
			res.status(500).send({message: "Parsing error when liking.", error: e, code: 'FAILURE'})
			throw (e)
		}
		else {
			console.log("EROOL: ", e)
			res.status(500).send({message: "Error in block user ", error: e})
			throw(e)
		}
	}
}


exports.un_block_user = async (req, res) => {
	try {
		let unblock_query_result = await db.query(
			"DELETE FROM BLOCKS \
			WHERE blocker = ? and blocked = ?",
			[req.username, req.body.unblocked])
		res.status(200).send({message: 'Succesfully blocked user', data: unblock_query_result, code: "SUCCESS"})
	}
	catch (e) {
		if (e.code == 'ER_PARSE_ERROR') {
			res.status(500).send({message: "Parsing error when liking.", error: e, code: 'FAILURE'})
			throw (e)
		}
		else {
			console.log("EROOL: ", e)
			res.status(500).send({message: "Error in block user ", error: e})
			throw(e)
		}
	}
}

exports.get_users_that_i_blocked = async (req, res) => {
	try {

		let rows = await db.query(
			'SELECT * \
			FROM BLOCKS \
			INNER JOIN USERS \
			ON BLOCKS.blocked=USERS.username \
			WHERE BLOCKS.blocker=?;', 
			req.username,)
		// console.log("ROOOS:", rows)
		// console.log("blocker: ", req.body.blocker_username)
		res.status(200).send({message: 'Successfully queried blocked users.', data: rows, code:'SUCCESS'})
	}
	catch (e) {
		if (e.code == 'ER_NO_REFERENCED_ROW') {
			console.log("NO BLOCKS", e)
			res.status(200).send({message: "User not blocked", data:[], code: e.code})
		}
		else {
			console.log("get user by id error:\n", e, "\nend error")
			res.status(500).send({message: 'error in get user by id', error: e})
			throw(e)
		}
	}	
}


exports.get_users_that_blocked_me = async (req, res) => {
	try {

		let rows = await db.query(
			'SELECT * \
			FROM BLOCKS \
			INNER JOIN USERS \
			ON BLOCKS.blocker=USERS.username \
			WHERE BLOCKS.blocked=?;', 
			req.username,)
		// console.log("ROOOS:", rows)
		// console.log("blocker: ", req.body.blocker_username)
		res.status(200).send({message: 'Successfully queried blocked you users.', data: rows, code:'SUCCESS'})
	}
	catch (e) {
		if (e.code == 'ER_NO_REFERENCED_ROW') {
			console.log("NO BLOCKS", e)
			res.status(200).send({message: "nobody BLOCKS you mark", data:[], code: e.code})
		}
		else {
			console.log("get user by id error:\n", e, "\nend error")
			res.status(500).send({message: 'error in get user by id', error: e})
			throw(e)
		}
	}	
}

// exports.get_block_matches = async (req, res) => {
// 	try {
// 		let rows = await db.query(
// 			"SELECT r1.blocker, r1.blocked, \
// 				IF(( SELECT COUNT(*)  \
// 					FROM   BLOCKS r2  \
// 					WHERE  r2.blocker = r1.blocked AND r2.blocked = r1.blocker \
// 				) > 0, 1, 0) AS reciprocal \
// 			FROM   BLOCKS r1 \
// 			WHERE  r1.blocker = ?;",
// 			req.body.username)
// 		// console.log("ROOOS:", rows)
// 		matches = rows.filter(a =>  a.reciprocal == 1)
// 		matches = matches.map(function(a) {return a.blocked})
// 		// console.log("ROOOS:", matches)
// 		res.status(200).send({message: 'Successfully queried blocked you users.', data: matches, code:'SUCCESS'})
// 	}
// 	catch (e) {
// 		if (e.code == 'ER_NO_REFERENCED_ROW') {
// 			console.log("NO BLOCKS", e)
// 			res.status(200).send({message: "nobody BLOCKS you mark", data:[], code: e.code})
// 		}
// 		else {
// 			console.log("get user by id error:\n", e, "\nend error")
// 			res.status(500).send({message: 'error in get user by id', error: e})
// 			throw(e)
// 		}
// 	}	
// }