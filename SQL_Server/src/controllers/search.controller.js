const db       = require("../db/sql.conn");
const searches = require("./user.request.js")

exports.get_all_users = async (req, res) => {
	console.log("getting all users relative to: ", req.username)
	console.log("criteria: ", "min_age :", req.body.min_age,"max_age :", req.body.max_age,"interest_tags :", req.body.interest_tags,"min_rating :", req.body.min_rating,"zipcodes :", req.body.zipcodes)
	try {
		let user_query = await searches.get_all_users(req.username)
		console.log(user_query)
		console.log("Rows: ", user_query.map(user => user.username))
		res.status(200).send({message: 'Successfully queried users.', data: user_query})
	}
	catch (e) {
		console.log("get user by name error:\n", e, "\nend error")
		res.status(500).send({message: 'error in get users', error: e})
		throw(e)
	}	
}




