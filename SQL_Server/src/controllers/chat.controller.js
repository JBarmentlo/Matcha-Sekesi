const db              = require("../db/sql.conn");


exports.get_all_messages = async (req, res) => {
	console.log("gettin messages")
	try {
		let keri_string =
			"WITH MATCHES AS ( \
				SELECT l1.liker, l1.liked as matchee \
				FROM LIKES l1 INNER JOIN LIKES l2 \
					ON l1.liked = l2.liker \
					AND l1.liker = l2.liked \
					AND l1.liker != l1.liked \
					AND l1.liker = @searcher \
					AND l1.liker NOT IN (select blocked FROM BLOCKS WHERE blocker = @searcher) \
					AND l1.liker NOT IN (select blocker FROM BLOCKS WHERE blocked = @searcher)) \
			 \
			SELECT MSG.id, sender, receiver, msg, last_updated FROM MATCHES INNER JOIN MSG \
				ON (MSG.receiver IN (@searcher, matchee) \
				AND MSG.sender IN (@searcher, matchee)) \
				ORDER BY last_updated DESC;".replace(new RegExp("@searcher", "g"), `'${req.username}'`)
		// console.log(keri_string)
		let message_keri = await db.query(keri_string)
		console.log("got : ", message_keri)
		return res.status(200).send({message: 'Successfully queried your messages.', data: message_keri, code:'SUCCESS'})
	}
	catch (e) {
		console.log("get messages error:\n", e, "\nend error")
		throw(e)
	}
}	

exports.get_conversation = async (req, res) => {
	console.log("gettin convo ", 'username: ',  req.username,  'username: ', req.body.username,  'offset: ', req.body.offset,  'limi: ', req.body.limit)
	try {
		let keri_string =
			"SELECT id, sender, receiver, msg, last_updated FROM MSG  \
			WHERE (MSG.receiver IN (@one, @two)  \
			AND MSG.sender IN (@one, @two))  \
			ORDER BY last_updated DESC  \
			LIMIT @limit OFFSET @offset;"
			.replace(new RegExp("@one"   , "g"), `'${req.username}'`     )
			.replace(new RegExp("@two"   , "g"), `'${req.body.username}'`)
			.replace(new RegExp("@offset", "g"), `${req.body.offset}`  )
			.replace(new RegExp("@limit" , "g"), `${req.body.limit}`   )
		// console.log(keri_string)
		let message_keri = await db.query(keri_string)
		// console.log("got convo : ", message_keri)
		return res.status(200).send({message: 'Successfully queried your messages.', data: message_keri, code:'SUCCESS'})
	}
	catch (e) {
		console.log("get messages error:\n", e, "\nend error")
		throw(e)
	}
}	