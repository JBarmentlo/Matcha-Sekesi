const { query }       = require("express");
const db              = require("../db/sql.conn");

// Type: LIKE, UNLIKE, CONSULT, MATCH, UNMATCH, MESSAGE
exports.create_notif = async (type, source, target) => {
	// console.log(type,": ", source, " -> ", target)
	try {
		if (type == "LIKE") {
			let love_query = await db.query(
				"SELECT 1 \
				FROM LIKES \
				WHERE LIKES.liker=? AND LIKES.liked=?;",
				[target, source])
			if (love_query.length == 1) {
				type = "MATCH"
			}
		}
		//  Here we assume the unlike is valid and hence the source -> target like existed : if the target -> source like exists it was a match
		if (type == "UNLIKE") {
			let love_query = await db.query(
				"SELECT 1 \
				FROM LIKES \
				WHERE LIKES.liker=? AND LIKES.liked=?;",
				[target, source])
			// console.log(love_query)
			if (love_query.length == 1) {
				type = "UNMATCH"
			}
			else {
				return {message: "Simple unlike no notif", code: "SUCCESS", id: notif_query.insertId}
			}
		}
		// console.log("FINALE TYPE : ", type)
		notif_query = await db.query(
			" INSERT INTO NOTIFS \
			  (type, source_user, target_user) \
			  VALUES (?, ?, ?);"
			, [type, source, target]
			)
		return {code: "SUCCESS", id: notif_query.insertId}
	}
	catch (e) {
		if (e.code == 'ER_BAD_NULL_ERROR') {
			throw(e)	
			return "FAILURE"
		}
		else {
			console.log("error in create notif:", e)
			throw(e)	
			return "FAILURE"
		}
	}
} 

exports.get_my_notifs = async (req, res) => {
	// console.log("get notif: ", [req.username, req.body.limit, req.body.offset])
	try {
		notif_query = await db.query(
			"SELECT * FROM NOTIFS \
			WHERE target_user=? AND \
			NOT EXISTS (SELECT 1 FROM BLOCKS \
				WHERE NOTIFS.source_user = BLOCKS.blocked AND NOTIFS.target_user = BLOCKS.blocker OR \
				NOTIFS.source_user = BLOCKS.blocker AND NOTIFS.target_user = BLOCKS.blocked) \
				LIMIT ? OFFSET ?;",
			[req.username, req.body.limit, req.body.offset],)
		return res.status(200).send({message: "succesfull notif query", data: notif_query, code: "SUCCESS"})
	}
	catch (e) {
		console.log(e)
		throw (e)
		return res.status(201).send({message: "failed notif query", data: [], code: "FAILURE"})
	}
}

exports.set_seen_notif = async (req, res) => {
	try {
		notif_query = await db.query(
			"UPDATE NOTIFS\
			set seen=1 \
			WHERE id=? and target_user=?;",
			[req.body.id, req.username],)
		return res.status(200).send({message: "succesfull notif set seen", data: notif_query, code: "SUCCESS"})
	}
	catch (e) {
		console.log(e)
		throw (e)
		return res.status(201).send({message: "failed notif set seen", data: [], code: "FAILURE"})
	}
}

