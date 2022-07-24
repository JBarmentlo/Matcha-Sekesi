const mysql = require('mysql2/promise')

async function connect() {

	const connection = await mysql.createConnection({
		host: 'localhost',
		user: 'sammy',
		database: process.env.MATCHA_DB,
		password: 'password'
	  });

	const test_connection = await mysql.createConnection({
		host: 'localhost',
		user: 'sammy',
		database: process.env.MATCHA_TEST_DB,
		password: 'password'
		});

	if (process.env.TEST == 'true') {
		return test_connection
	}
	else {
		return connection
	}
}

const pool = mysql.createPool({
	host: 'localhost',
	user: 'sammy',
	database: process.env.MATCHA_DB,
	password: 'password',
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0
  });

async function query(sql, params) {
	const connection = await mysql.createConnection({
		host: 'localhost',
		user: 'sammy',
		database: process.env.MATCHA_DB,
		password: 'password'
	  });

	const test_connection = await mysql.createConnection({
		host: 'localhost',
		user: 'sammy',
		database: process.env.MATCHA_TEST_DB,
		password: 'password'
		});

	let used_connection
	if (process.env.TEST == 'true') {
		used_connection = test_connection
	}
	else {
		used_connection = connection
	}
	const [results, ] = await used_connection.execute(sql, params);

	return results;
}
// connection = connect()
// module.exports = pool
// module.exports = connect()
module.exports = {
	query,
	conn: connect()
  }