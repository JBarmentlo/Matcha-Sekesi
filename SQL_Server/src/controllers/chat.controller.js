const db              = require("../db/sql.conn");


exports.get_messages = async (req, res) => {
	console.log("gettin messages")
	try {
		let keri_string = 			"WITH MATCHES AS (                                                                   \
			SELECT l1.liker, l1.liked as matchee                                            \
			FROM LIKES l1 INNER JOIN LIKES l2                                               \
				ON l1.liked = l2.liker                                                      \
				AND l1.liker = l2.liked                                                     \
				AND l1.liker != l1.liked                                                    \
				AND l1.liker = @searcher                                                    \
				AND l1.liker NOT IN (select blocked FROM BLOCKS WHERE blocker = @searcher)  \
				AND l1.liker NOT IN (select blocker FROM BLOCKS WHERE blocked = @searcher)) \
																							\
		SELECT * FROM MATCHES INNER JOIN MSG                                                \
			ON (MSG.receiver IN (@searcher, matchee)                                        \
			AND MSG.receiver IN (@searcher, matchee));".replace(new RegExp("@searcher", "g"), `'${req.username}'`)
		console.log(keri_string)
		let message_keri = await db.query(keri_string)
		console.log("got : ", message_keri)
		return res.status(200).send({message: 'Successfully queried your messages.', data: message_keri, code:'SUCCESS'})
	}
	catch (e) {
		console.log("get messages error:\n", e, "\nend error")
		throw(e)
	}
}	

