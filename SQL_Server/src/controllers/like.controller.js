const db	 	= require("../db/sql.conn");


exports.like_user = async (req, res) => {
	let liked_id = req.body.liked_id
	let liker_id = req.body.liker_id


	let [liked_query, ] = await db.query('select * from USERS where id=?', liked_id)
	let [liker_query, ] = await db.query('select * from USERS where id=?', liker_id)
	if (typeof liked_query !== 'undefined' && liked_query !== null && typeof liker_query !== 'undefined' && liker_query !== null){
		let like_query_result = await db.query(
			'INSERT INTO LIKES \
			(liker, liked) \
			VALUES (?, ?)',
			[liked_query.username, liked_query]
			)
		res.status(200).send({message: 'Succesfully liked user'})
	}
	else {
		console.log("MISSING: ",liked_query, liker_query)
		res.status(200).send({message: "One of the users does not exist", code:"LIKE_MISS"})
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