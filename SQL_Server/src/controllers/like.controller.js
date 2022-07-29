const db	 	= require("../db/sql.conn");


exports.like_user = async (req, res) => {
	let liked_id = req.body.liked_id
	let liker_id = req.body.liker_id


	let [liked_query, ] = await db.query('select * from USERS where id=?', liked_id)
	let [liker_query, ] = await db.query('select * from USERS where id=?', liker_id)
	try {
		if (typeof liked_query !== 'undefined' && liked_query !== null && typeof liker_query !== 'undefined' && liker_query !== null){
			let like_query_result = await db.query(
				'INSERT INTO LIKES \
				(liker, liked) \
				VALUES (?, ?)',
				[liker_query.username, liked_query.username]
				)
			res.status(200).send({message: 'Succesfully liked user', code: "SUCCESS"})
			// console.log(like_query_result)
		}
		else {
			res.status(200).send({message: "One of the users does not exist", code:"LIKE_MISS"})
		}
	}
	catch (e) {
		if (e.code == 'ER_NO_REFERENCED_ROW') {
			res.status(200).send({message: "User name not existing", code: e.code})
		}
		else if (e.code == 'ER_DUP_ENTRY') {
			res.status(200).send({message: "Already Liked", code: e.code})
		}
		else if (e.code == 'ER_PARSE_ERROR') {
			res.status(500).send({message: "Parsing error when liking.", error: e, code: 'FAILURE'})
			throw (e)
		}
		else {
			console.log("EROOL: ", e)
			res.status(500).send({message: "Error in like user ", error: e})
			throw(e)
		}
	}


}

exports.get_users_that_i_liked = async (req, res) => {
	try {

		let rows = await db.query(
			'SELECT * \
			FROM LIKES \
			INNER JOIN USERS \
			ON LIKES.liked=USERS.username \
			WHERE LIKES.liker=?;', 
			req.body.liker_username,)
		// console.log("ROOOS:", rows)
		// console.log("Liker: ", req.body.liker_username)
		res.status(200).send({message: 'Successfully queried liked users.', data: rows, code:'SUCCESS'})
	}
	catch (e) {
		if (e.code == 'ER_NO_REFERENCED_ROW') {
			console.log("NO LIKES", e)
			res.status(200).send({message: "User not liked", data:[], code: e.code})
		}
		else {
			console.log("get user by id error:\n", e, "\nend error")
			res.status(500).send({message: 'error in get user by id', error: e})
			throw(e)
		}
	}	
}



exports.get_users_that_liked_me = async (req, res) => {
	try {

		let rows = await db.query(
			'SELECT * \
			FROM LIKES \
			INNER JOIN USERS \
			ON LIKES.liker=USERS.username \
			WHERE LIKES.liked=?;', 
			req.body.liked_username,)
		// console.log("ROOOS:", rows)
		// console.log("Liker: ", req.body.liker_username)
		res.status(200).send({message: 'Successfully queried liked you users.', data: rows, code:'SUCCESS'})
	}
	catch (e) {
		if (e.code == 'ER_NO_REFERENCED_ROW') {
			console.log("NO LIKES", e)
			res.status(200).send({message: "nobody likes you mark", data:[], code: e.code})
		}
		else {
			console.log("get user by id error:\n", e, "\nend error")
			res.status(500).send({message: 'error in get user by id', error: e})
			throw(e)
		}
	}	
}