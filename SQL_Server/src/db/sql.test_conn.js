const mysql = require('mysql2/promise')

async function connect() {
	const connection = await mysql.createConnection({
		host: 'localhost',
		user: 'sammy',
		database: 'sekesitest',
		password: 'password'
	  });

	return connection
}

const pool = mysql.createPool({
	host: 'localhost',
	user: 'sammy',
	database: 'sekesitest',
	password: 'password',
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0
  });

async function query(sql, params) {
	const connection = await mysql.createConnection({
		host: 'localhost',
		user: 'sammy',
		database: 'sekesitest',
		password: 'password'
	  })
	const [results, ] = await connection.execute(sql, params);

	return results;
}

async function clear_all() {
	conn = await connect()
	await conn.query('DELETE FROM USERS;')
	await conn.query('DELETE FROM BLOCKS;')
	await conn.query('DELETE FROM CONSULTS;')
	await conn.query('DELETE FROM LIKES;')
	await conn.query('DELETE FROM PICTURES;')
	await conn.query('DELETE FROM TAGS;')
	await conn.query('DELETE FROM VERIFY;')
}

module.exports = {
	query,
	conn: connect(),
	clear_all:clear_all
  }