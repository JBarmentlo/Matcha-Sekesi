const mysql = require('mysql2/promise')

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'sammy',
	database: process.env.MATCHA_DB,
	password: 'password'
  });


const test_connection = mysql.createConnection({
	host: 'localhost',
	user: 'sammy',
	database: process.env.MATCHA_TEST_DB,
	password: 'password'
	});

async function connect() {
	if (process.env.ENVIRONMENT == 'TEST') {
		return test_connection
	}
	else {
		return connection
	}
}

// const pool = mysql.createPool({
// 	host: 'localhost',
// 	user: 'sammy',
// 	database: process.env.MATCHA_DB,
// 	password: 'password',
// 	waitForConnections: true,
// 	connectionLimit: 10,
// 	queueLimit: 0
//   });

async function query(sql, params) {
	let used_connection
	if (process.env.ENVIRONMENT == 'TEST') {
		used_connection = await test_connection
	}
	else {
		used_connection = await connection
	}
	// console.log(sql)
	// console.log("daba: ",used_connection.config.database)
	// console.log("KERI:\n", sql, "\n\n, params: ", params)
	const [results, ] = await used_connection.query(sql, params);
	// console.log("results:\n", results)

	return results;
}

async function drop_all() {
	let used_connection
	if (process.env.ENVIRONMENT == 'TEST') {
		used_connection = await test_connection
	}
	else {
		used_connection = await connection
	}
	console.log("DROP ALL FROM TABLE")
	used_connection.execute('DELETE FROM BLOCKS;')
	used_connection.execute('DELETE FROM CONSULTS;')
	used_connection.execute('DELETE FROM LIKES;')
	used_connection.execute('DELETE FROM PICTURES;')
	used_connection.execute('DELETE FROM TAGS;')
	used_connection.execute('DELETE FROM USERS;')
	used_connection.execute('DELETE FROM VERIFY;')										
}

// connection = connect()
// module.exports = pool
// module.exports = connect()
module.exports = {
	query,
	conn: connect(),
	drop_all
  }