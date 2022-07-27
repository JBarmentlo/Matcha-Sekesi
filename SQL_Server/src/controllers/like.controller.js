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
				[liked_query.username, liker_query.username]
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

// try {
// 	let query_result = await db.query(
// 		'INSERT INTO USERS \
// 		(username, firstName, lastName, bio, mail, password, mailVerified, gender, sekesualOri, popScore, zipCode, city, isCompleteProfile, longitude, latitude) \
// 		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
// 		[username, firstName, lastName, bio, mail, password, mailVerified, gender, sekesualOri, popScore, zipCode, city, isCompleteProfile, longitude, latitude]
// 		)
// 	res.status(200).send({message: 'Succesfully created user', id: query_result.insertId})
// }
// catch (e) {
// 	if (e.code == 'ER_DUP_ENTRY') {
// 		res.status(200).send({message: e.sqlMessage, code: e.code})
// 	}
// 	else {
// 		console.log("signup error:\n", e, "\nend signup error")
// 		res.status(500).send({message: e})
// 	}
// }	