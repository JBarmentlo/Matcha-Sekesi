const db = require("../db/sql.conn");
const NotifController = require('./notif.controller')


exports.like_user = async (req, res) => {
	// console.log("liking: ", req.body.liked)
	try {
		let like_query_result = await db.query(
			'INSERT INTO LIKES \
			(liker, liked) \
			VALUES (?, ?)',
			[req.username, req.body.liked]
			)
		// console.log(like_query_result)
		await NotifController.create_notif("LIKE", req.username, req.body.liked)
		return res.status(200).send({message: 'Succesfully liked user', code: "SUCCESS"})
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
			console.log("EROOR in like: ", e)
			return res.status(403).send({message: "Parsing error when liking.", error: e, code: 'FAILURE'})
			throw (e)
		}
		else {
			console.log("EROOL: ", e)
			return res.status(500).send({message: "Error in like user ", error: e})
			// throw(e)
		}
	}
}

exports.un_like_user = async (req, res) => {
	try {
		let unlike_query_result = await db.query(
			"DELETE FROM LIKES \
			WHERE liker = ? and liked = ?",
			[req.username, req.body.unliked])
		await NotifController.create_notif("UNLIKE", req.username, req.body.unliked)
		return res.status(200).send({message: 'Succesfully unliked user', data: unlike_query_result, code: "SUCCESS"})
	}
	catch (e) {
		if (e.code == 'ER_PARSE_ERROR') {
			return res.status(403).send({message: "Parsing error when unliking.", error: e, code: 'FAILURE'})
			throw (e)
		}
		else {
			console.log("EROR unlike: ", e)
			return res.status(500).send({message: "Error in unlike user ", error: e})
			// throw(e)
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
			,req.username,)
		// console.log("ROOOS:", rows)
		// console.log("Liker: ", req.body.liker_username)
		return res.status(200).send({message: 'Successfully queried liked users.', data: rows, code:'SUCCESS'})
	}
	catch (e) {
		if (e.code == 'ER_NO_REFERENCED_ROW') {
			console.log("NO LIKES", e)
			return res.status(200).send({message: "User not liked", data:[], code: e.code})
		}
		else {
			console.log("get user by id error:\n", e, "\nend error")
			return res.status(500).send({message: 'error in get user by id', error: e})
			// throw(e)
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

		
			,[req.username],)
		// console.log("Liker: ", req.body.liker_username)
		return res.status(200).send({message: 'Successfully queried liked you users.', data: rows, code:'SUCCESS'})
	}
	catch (e) {
		if (e.code == 'ER_NO_REFERENCED_ROW') {
			console.log("NO LIKES", e)
			return res.status(200).send({message: "nobody likes you mark", data:[], code: e.code})
		}
		else {
			console.log("get user by id error:\n", e, "\nend error")
			return res.status(500).send({message: 'error in get user by id', error: e})
			// throw(e)
		}
	}	
}

exports.get_matches = async (req, res) => {
	try {
		let rows = await db.query(
			`
			WITH
			MATCHES AS (
				SELECT l1.liker as matcher, l1.liked as matchee
					FROM LIKES l1 INNER JOIN LIKES l2
						ON l1.liked = l2.liker
						AND l1.liker = l2.liked
						AND l1.liker != l1.liked
			),

			BLOCKED as (
				SELECT
					blocked,
					SUM(blocker='${req.username}') > 0 as did_i_block_him
				FROM
					BLOCKS
				GROUP BY
					blocked
			)

			SELECT
				matcher as liker,
				matchee,
				profilePic,
				IFNULL(did_i_block_him, 0) as blocked_source

			FROM MATCHES
				LEFT JOIN BLOCKED
					ON MATCHES.matcher = BLOCKED.blocked
				LEFT JOIN USERS
					ON MATCHES.matcher = USERS.username
			WHERE
				matchee='${req.username}'
			HAVING
				blocked_source=0;
			`
			, req.username)
		console.log("matches: ", req.username, rows)
		return res.status(200).send({message: 'Successfully queried matches users.', data: rows, code:'SUCCESS'})
	}
	catch (e) {
		if (e.code == 'ER_NO_REFERENCED_ROW') {
			console.log("NO LIKES", e)
			return res.status(200).send({message: "nobody likes you mark", data:[], code: e.code})
		}
		else {
			console.log("get user by id error:\n", e, "\nend error")
			return res.status(500).send({message: 'error in get user by id', error: e})
			// throw(e)
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

