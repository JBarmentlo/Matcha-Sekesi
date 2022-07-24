const db	 	= require("../db/sql.conn");
var bcrypt 		= require("bcryptjs");



exports.signup = async (req, res) => {
	let username        = req.body.username;
	let firstName       = req.body.firstName;
	let lastName        = req.body.lastName;
	let mail            = req.body.mail;
	let password        = bcrypt.hashSync(req.body.password, 8);
	// let password        = req.body.password;
	let zipCode        	= req.body.zipCode;
	let city       		= req.body.city;
	let latitude        = req.body.latitude;
	let longitude       = req.body.longitude;
	// con = await db.conn
	// console.log("database", con.connection.config.database)
	try {
		let query_result = await db.query(
			'INSERT INTO USERS (username, mail, firstName, lastName, password, zipCode, longitude, latitude, city) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
			[username, mail, firstName, lastName, password, zipCode, longitude, latitude, city]
			)
		// console.log("queri: ", query_result)
		res.status(200).send({message: 'Succesfully created user', id: query_result.insertId})
	}
	catch (e) {
		if (e.code == 'ER_DUP_ENTRY') {
			// console.log("DUP ENTRY:\n", e, "\nend signup error")
			res.status(200).send({message: e.sqlMessage, code: e.code})
		}
		else {
			console.log("signup error:\n", e, "\nend signup error")
			throw(e)
		}
	}
		
};
