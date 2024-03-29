const { existsSync } = require("fs");
const db = require("../db/sql.conn");


exports.get_all_messages = async (req, res) => {
	// console.log("gettin messages")
	try {
		let keri_string =
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
	MSG.id,
	sender,
	receiver,
	msg,
	last_updated,
	IFNULL(did_i_block_him, 0) as blocked_source
FROM MATCHES
INNER JOIN MSG
	ON (MSG.receiver IN ('${req.username}', matchee)
	AND MSG.sender IN ('${req.username}', matchee))
LEFT JOIN BLOCKED
	ON BLOCKED.blocked = MSG.sender
HAVING
	blocked_source=0
ORDER BY last_updated DESC LIMIT 1000 OFFSET 0;
`
		// console.log(keri_string)
		let message_keri = await db.query(keri_string)
		// console.log("all msg", req.username,  message_keri.map(m => m.id))
		return res.status(200).send({message: 'Successfully queried your messages.', data: message_keri, code:'SUCCESS'})
	}
	catch (e) {
		console.log("get messages error:\n", e, "\nend error")
		return res.status(400).send({message: 'Failed in querying your messages.', data: [], code:'FAILURE'})
	}
}


exports.get_all_new_messages = async (req, res) => {
	// console.log("gettin messages")
	try {
		let keri_string =
`
WITH
MYMATCHES AS (
    SELECT l1.liker as matcher, l1.liked as matchee
        FROM LIKES l1 INNER JOIN LIKES l2
            ON  l1.liked = '${req.username}'
            AND l1.liked = l2.liker
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
	MSG.id,
	sender,
	receiver,
	msg,
	last_updated,
	IFNULL(did_i_block_him, 0) as blocked_source
FROM MYMATCHES
INNER JOIN MSG
	ON (MSG.receiver IN ('${req.username}', matcher)
	AND MSG.sender IN ('${req.username}', matcher))
LEFT JOIN BLOCKED
	ON BLOCKED.blocked = MSG.sender
WHERE
	last_updated > '${req.body.last_time}'
HAVING
	blocked_source=0
ORDER BY last_updated DESC LIMIT 100 OFFSET 0;
`
		let message_keri = await db.query(keri_string)
		// console.log("new msg", req.username, req.body.last_time, message_keri.map(m => m.id))
		return res.status(200).send({message: 'Successfully queried your messages.', data: message_keri, code:'SUCCESS'})
	}
	catch (e) {
		console.log("get messages error:\n", e, "\nend error")
		return res.status(400).send({message: 'Failed in querying your messages.', data: [], code:'FAILURE'})
	}
}	


exports.get_all_new_messages_id = async (req, res) => {
	// console.log("gettin messages")
	try {
		if (req.body.last_id == null) {
			req.body.last_id = -1
			console.log("defaulting last ID Chat", req.username)
		}
		let keri_string =
`
WITH
MYMATCHES AS (
    SELECT l1.liker as matcher, l1.liked as matchee
        FROM LIKES l1 INNER JOIN LIKES l2
            ON  l1.liked = '${req.username}'
            AND l1.liked = l2.liker
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
	MSG.id,
	sender,
	receiver,
	msg,
	last_updated,
	IFNULL(did_i_block_him, 0) as blocked_source
FROM MYMATCHES
INNER JOIN MSG
	ON (MSG.receiver IN ('${req.username}', matcher)
	AND MSG.sender IN ('${req.username}', matcher))
LEFT JOIN BLOCKED
	ON BLOCKED.blocked = MSG.sender
WHERE
	MSG.id > '${req.body.last_id}'
HAVING
	blocked_source=0
ORDER BY last_updated DESC LIMIT 100 OFFSET 0;
`
		let message_keri = await db.query(keri_string)
		// console.log("new msg", req.username, req.body.last_time, message_keri.map(m => m.id))
		return res.status(200).send({message: 'Successfully queried your messages.', data: message_keri, code:'SUCCESS'})
	}
	catch (e) {
		console.log("get messages error:\n", e, "\nend error")
		return res.status(400).send({message: 'Failed in querying your messages.', data: [], code:'FAILURE'})
	}
}	

exports.get_current_id = async (req, res) => {
	try {
		current_id = await db.query(
			`SELECT IFNULL(MAX(id), -1) as last_id from MSG;`)
		console.log(current_id)
		return res.status(200).send({message: "succesfull id request", last_id: current_id[0].last_id, code: "SUCCESS"})
	}
	catch (e) {
		console.log(e)
		return res.status(201).send({message: "failed id", last_id: -1, code: "FAILURE"})
	}
}

exports.get_conversation = async (req, res) => {
	// console.log("gettin convo ", 'username: ',  req.username,  'username: ', req.body.username,  'offset: ', req.body.offset,  'limi: ', req.body.limit)
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
		return res.status(400).send({message: 'Failed in querying your conversation.', data: [], code:'FAILURE'})
	}
}

exports.send_message = async (req, res) => {
	console.log("sending ", 'username: ',  req.username,  'username: ', req.body.username,  'message: ', req.body.msg, req.body.convoId)
	try {
		let keri_string =
			`INSERT INTO MSG (sender, receiver, msg, convoId)
				VALUES (@sender, @receiver, @msg, @convoId);`
			.replace(new RegExp("@sender"   , "g"), `'${req.username}'`     )
			.replace(new RegExp("@receiver" , "g"), `'${req.body.username}'`)
			.replace(new RegExp("@msg"      , "g"), `'${req.body.msg}'`     )
			.replace(new RegExp("@convoId"  , "g"), `'${req.body.convoId}'` )
		// console.log(keri_string)
		let message_keri = await db.query(keri_string)
		console.log("sent message: ", message_keri)
		return res.status(200).send({message: 'Successfully inserted message.', data: message_keri, code:'SUCCESS'})
	}
	catch (e) {
		return res.status(400).send({message: 'Failed in sending your data.', data: [], code:'FAILURE'})
		console.log("send message error:\n", e, "\nend error")
	}
}	