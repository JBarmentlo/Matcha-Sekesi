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
				return {message: "Simple unlike no notif", code: "SUCCESS", id: 0}
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
			// // throw(e)	
			return "FAILURE"
		}
		else {
			console.log("error in create notif:", e)
			// // throw(e)	
			return "FAILURE"
		}
	}
} 

exports.get_current_time = async (req, res) => {
	try {
		current_time = await db.query(
			`
			SELECT
				last_connected
			FROM
				USERS
			WHERE
				username=?
			`,
			[req.username],)
		return res.status(200).send({message: "succesfull time request", data: current_time[0].last_connected, code: "SUCCESS"})
	}
	catch (e) {
		console.log(e)
		return res.status(201).send({message: "failed time query", data: '2023-02-16T18:34:44.000Z', code: "FAILURE"})
		throw (e)
	}
}

exports.get_my_notifs = async (req, res) => {
	try {
		notif_query = await db.query(
			`
			WITH
			BLOCKED as (
				SELECT
					blocked,
					SUM(blocker=?) > 0 as did_i_block_him
				FROM
					BLOCKS
				GROUP BY
					blocked
			)

			SELECT 
				id,
				type,
				source_user,
				target_user,
				seen,
				last_updated,
				IFNULL(did_i_block_him, 0) as blocked_source
			FROM NOTIFS
				LEFT JOIN BLOCKED
					ON BLOCKED.blocked=NOTIFS.source_user
			WHERE 
				target_user=?
			HAVING
				blocked_source=0
			ORDER BY last_updated DESC LIMIT ? OFFSET ?;
			`
			,
			[req.username, req.username, req.body.limit, req.body.offset],)
		
		// console.log("get notif: ", req.username, notif_query.length)
		return res.status(200).send({message: "succesfull notif query", data: notif_query, code: "SUCCESS"})
	}
	catch (e) {
		console.log(e)
		throw (e)
		return res.status(201).send({message: "failed notif query", data: [], code: "FAILURE"})
	}
}

exports.get_my_new_notifs = async (req, res) => {
	try {
		notif_query = await db.query(
			`
			WITH
			BLOCKED as (
				SELECT
					blocked,
					SUM(blocker=?) > 0 as did_i_block_him
				FROM
					BLOCKS
				GROUP BY
					blocked
			)

			SELECT 
				id,
				type,
				source_user,
				target_user,
				seen,
				last_updated,
				IFNULL(did_i_block_him, 0) as blocked_source
			FROM NOTIFS
				LEFT JOIN BLOCKED
					ON BLOCKED.blocked=NOTIFS.source_user
			WHERE 
				target_user=?
			AND
				last_updated >= ?
			HAVING
				blocked_source=0
			ORDER BY last_updated DESC LIMIT ? OFFSET ?;
			`
			,
			[req.username, req.username, req.body.after_said_time, req.body.limit, req.body.offset],)
		
		// console.log("get notif: ", req.username, notif_query.length)
		return res.status(200).send({message: "succesfull notif query", data: notif_query, code: "SUCCESS"})
	}
	catch (e) {
		console.log(e)
		throw (e)
		return res.status(201).send({message: "failed notif query", data: [], code: "FAILURE"})
	}
}

exports.set_seen_notifs = async (req, res) => {
	try {
		if (req.body.id_list.length == 0) {
			return res.status(200).send({message: "succesfull notif set seen", data: notif_query, code: "SUCCESS"})
		}
		let id_list_str = '('
		let first = true
		for (const id of req.body.id_list) {
			if (first) {
				id_list_str += `'${id}'`
				first = false
			}
			else {
				id_list_str += ','
				id_list_str += `'${id}'`
			}
		}
		id_list_str += ')'
		notif_query = await db.query(
			"UPDATE NOTIFS\
			set seen=1 \
			WHERE id IN id_list and target_user=?;".replace('id_list',  id_list_str),
			[req.username],)
		return res.status(200).send({message: "succesfull notif set seen", data: notif_query, code: "SUCCESS"})
	}
	catch (e) {
		console.log(e)
		throw (e)
		return res.status(201).send({message: "failed notif set seen", data: [], code: "FAILURE"})
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

exports.delete_notif = async (req, res) => {
	try {
		notif_query = await db.query(
			"DELETE FROM NOTIFS\
			 WHERE target_user = ? AND id = ?;",
			[req.username, req.body.id],)
		return res.status(200).send({message: "succesfull notif delete", data: notif_query, code: "SUCCESS"})
	}
	catch (e) {
		console.log(e)
		throw (e)
		return res.status(201).send({message: "failed notif delete", data: [], code: "FAILURE"})
	}
}
