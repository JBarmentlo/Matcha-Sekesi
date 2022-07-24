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

async function query(sql, params) {
	const connection = await mysql.createConnection({
		host: 'localhost',
		user: 'sammy',
		database: 'sekesidb',
		password: 'password'
	  })
const [results, ] = await connection.execute(sql, params);

return results;
}
// connection = connect()
// module.exports = pool
// module.exports = connect()
module.exports = {
	query,
	conn: connect()
  }