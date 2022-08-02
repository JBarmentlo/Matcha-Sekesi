const { expect } = require("chai");
const { query } = require("express");
const db       = require("../db/sql.conn");

// Type: LIKE, CONSULT, MATCH, UNMATCH, MESSAGE
exports.create_notif = async (type, source, target) => {
	try {
		notif_query = await db.query(
			" INSERT INTO NOTIFS \
			  (type, source_user, target_user) \
			  VALUES (?, ?, ?);"
			, [type, source, target]
			)
		return {code: "SUCCESS", id: notif_query.insertedId}
	}
	catch (e) {
		console.log("error in create notif:", e)
		throw(e)	
		return "FAILURE"
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
		query = await db.query(
			"UPDATE NOTIFS n\
			set seen=1 \
			WHERE id=? and target_user=?;",
			[req.body.id, req.username],)
		console.log("KERI set seen NOOTIKF: ", query)
		res.status(200).send({message: "succesfull notif set seen", data: query, code: "SUCCESS"})
	}
	catch (e) {
		res.status(201).send({message: "failed notif set seen", data: [], code: "FAILURE"})
		throw (e)
	}
}

