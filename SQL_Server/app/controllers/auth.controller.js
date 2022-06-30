const db_conn 	= require("../db/sql.conn");
var bcrypt 		= require("bcryptjs");

exports.signup = async (req, res) => {
	let username        = req.body.username;
	let firstName       = req.body.firstName;
	let lastName        = req.body.lastName;
	let mail            = req.body.mail;
	// let password        = bcrypt.hashSync(req.body.password, 8);
	let password        = 'LOL';
	let zipCode         = "";
	let city       		= "Paris";
	let latitude        = 0.0;
	let longitude       = 0.0;
	db = await db_conn
	// let [rows, fields] = await db.execute(
	// 	'INSERT INTO USERS (?, ?, ?, ?, ?, ?, ?, ?, ?) VALUES (username, mail, firstName, lastName, crypt_pass, zipCode, longitude, latitude, city)'
	// 	[username, mail, firstName, lastName, password, zipCode, longitude, latitude, city]
	// 	)
	console.log([username, mail, firstName, lastName, password, zipCode, longitude, latitude, city])
	let [rows, fields] = await db.execute(
		'INSERT INTO USERS (username, mail, firstName, lastName, password, zipCode, longitude, latitude, city) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
		[username, mail, firstName, lastName, password, zipCode, longitude, latitude, city]
		)
	console.log(rows)
	console.log("rows")
};
