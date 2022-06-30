const mysql = require('mysql2/promise')

async function connect() {
	const connection = await mysql.createConnection({
		host: 'localhost',
		user: 'sammy',
		database: 'sekesidb',
		password: 'password'
	  });

	return connection
}

const pool = mysql.createPool({
	host: 'localhost',
	user: 'sammy',
	database: 'sekesidb',
	password: 'password',
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0
  });
// connection = connect()
module.exports = pool
