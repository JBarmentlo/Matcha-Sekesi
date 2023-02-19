const new_searches = require("./user.request.js")

exports.get_all_users = async (req, res) => {
	console.log("getting all users relative to: ", req.username)
	// console.log("criteria: ", "min_age :", req.body.min_age,"max_age :", req.body.max_age,"interest_tags :", req.body.interest_tags,"min_rating :", req.body.min_rating,"zipcodes :", req.body.zipcodes)
	try {
		let user_query = await searches.get_all_users(req.username)
		// console.log(user_query)
		// console.log("Rows: ", user_query.map(user => user.username))
		res.status(200).send({message: 'Successfully queried users.', data: user_query})
	}
	catch (e) {
		console.log("get user by name error:\n", e, "\nend error")
		res.status(500).send({message: 'error in get users', error: e})
	}	
}

exports.search_users = async (req, res) => {
	console.log("searching users : ")
	try {
		let user_query = await new_searches.search_users(req.username, req.body.min_age, req.body.max_age, req.body.required_tags, req.body.min_rating, req.body.max_rating, req.body.zipcodes, req.body.offset, req.body.limit, req.body.order_by, req.body.asc_or_desc)
		// console.log(user_query)
		// console.log("Rows: ", user_query.map(user => {return {name: user.username, age: user.age, score: user.popScore, zip: user.zipCode}}))
		res.status(200).send({message: 'Successfully queried users.', data: user_query})
	}
	catch (e) {
		console.log("get user by name error:\n", e, "\nend error")
		res.status(500).send({message: 'error in get users', error: e})
	}	
}

exports.search_users_initial = async (req, res) => {
	console.log("searching users initial: ", req.username, req.body.offset, req.body.limit)
	try {
		let user_query = await new_searches.search_users_initial(req.username, req.body.offset, req.body.limit)
		// console.log(user_query)
		// console.log("Rows: ", user_query.map(user => {return {name: user.username, age: user.age, score: user.popScore, zip: user.zipCode, tag_count: user.commonTagCount}}))
		res.status(200).send({message: 'Successfully queried users.', data: user_query})
	}
	catch (e) {
		console.log("get user by name error:\n", e, "\nend error")
		res.status(500).send({message: 'error in get users', error: e})
	}	
}
