const db = require("../db/sql.conn");


exports.clear_db = () => {
	console.log("DROP ALL FROM TABLE")
	let promise_BLOCKS = db.query('DELETE FROM BLOCKS;')
	let promise_CONSULTS = db.query('DELETE FROM CONSULTS;')
	let promise_LIKES = db.query('DELETE FROM LIKES;')
	let promise_PICTURES = db.query('DELETE FROM PICTURES;')
	let promise_TAGS = db.query('DELETE FROM TAGS;')
	let promise_USERS = db.query('DELETE FROM USERS;')
	let promise_VERIFY = db.query('DELETE FROM VERIFY;')
	return Promise.all([promise_BLOCKS ,promise_CONSULTS ,promise_LIKES ,promise_PICTURES ,promise_TAGS ,promise_USERS ,promise_VERIFY])
}