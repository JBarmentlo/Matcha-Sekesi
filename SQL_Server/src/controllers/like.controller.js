const db = require("../db/sql.conn");


exports.like_user_by_id = async (req, res) => {
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

exports.like_user = async (req, res) => {
	try {
		let like_query_result = await db.query(
			'REPLACE INTO LIKES \
			(liker, liked) \
			VALUES (?, ?)',
			[req.body.liker, req.body.liked]
			)
		res.status(200).send({message: 'Succesfully liked user', code: "SUCCESS"})
	}
	catch (e) {
		if (e.code == 'ER_NO_REFERENCED_ROW') {
			res.status(200).send({message: "User name not existing", code: e.code})
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

exports.un_like_user = async (req, res) => {
	try {
		let unlike_query_result = await db.query(
			"DELETE FROM LIKES \
			WHERE liker = ? and liked = ?",
			[req.body.unliker, req.body.unliked])
		res.status(200).send({message: 'Succesfully luniked user', data: unlike_query_result, code: "SUCCESS"})
	}
	catch (e) {
		if (e.code == 'ER_PARSE_ERROR') {
			res.status(500).send({message: "Parsing error when unliking.", error: e, code: 'FAILURE'})
			throw (e)
		}
		else {
			console.log("EROOL: ", e)
			res.status(500).send({message: "Error in unlike user ", error: e})
			throw(e)
		}
	}
}

exports.get_users_that_i_liked = async (req, res) => {
	try {

		let rows = await db.query(
			"SELECT * \
			FROM LIKES \
			INNER JOIN USERS \
			ON LIKES.liked=USERS.username \
			WHERE LIKES.liker=? AND \
			NOT EXISTS (SELECT 1 FROM BLOCKS  \
				WHERE LIKES.liker = BLOCKS.blocked AND LIKES.liked = BLOCKS.blocker OR \
				LIKES.liker = BLOCKS.blocker AND LIKES.liked = BLOCKS.blocked);" 
			,req.body.liker_username,)
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
			"SELECT * \
			FROM LIKES \
			INNER JOIN USERS \
			ON LIKES.liker=USERS.username\
			WHERE LIKES.liked=? AND \
			NOT EXISTS (SELECT 1 FROM BLOCKS  \
				WHERE LIKES.liker = BLOCKS.blocked AND LIKES.liked = BLOCKS.blocker OR \
				LIKES.liker = BLOCKS.blocker AND LIKES.liked = BLOCKS.blocked);"		

		
			,[req.body.liked_username, req.body.liked_username],)
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


exports.get_matches = async (req, res) => {
	try {
		let rows = await db.query(
			"SELECT LIKES.liker, LIKES.liked, \
				IF(( SELECT COUNT(*)  \
					FROM   LIKES r2  \
					WHERE  r2.liker = LIKES.liked AND r2.liked = LIKES.liker \
				) > 0, 1, 0) AS reciprocal \
			FROM   LIKES \
			WHERE  LIKES.liker = ? AND \
			NOT EXISTS (SELECT 1 FROM BLOCKS  \
				WHERE LIKES.liker = BLOCKS.blocked AND LIKES.liked = BLOCKS.blocker OR \
				LIKES.liker = BLOCKS.blocker AND LIKES.liked = BLOCKS.blocked);"
			, req.body.username)
		// console.log("ROOOS:", rows)
		matches = rows.filter(a =>  a.reciprocal == 1)
		matches = matches.map(function(a) {return a.liked})
		// console.log("ROOOS:", matches)
		res.status(200).send({message: 'Successfully queried liked you users.', data: matches, code:'SUCCESS'})
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

"SELECT u.user_id, u.user_name, c.user_one, c.user_two \
FROM user u \
INNER JOIN chat c \
    ON c.user_one = u.user_id OR \
       c.user_two = u.user_id \
WHERE \
    u.user_id = 16 AND \
    NOT EXISTS (SELECT 1 FROM block b \
                WHERE b.user_who = c.user_one AND b.blocked = c.user_two OR \
                      b.user_who = c.user_two AND b.blocked = c.user_one);"