const db = require("../db/sql.conn");

exports.upload_image = async (req, res) => {
	console.log("Uploading image")
	try {
		let filename = req.file.filename
		console.log('filename: ', req.file.filename, 'User: ', req.username)
		res.status(200).send({'filename': filename, url: "http://13.38.118.106:80/api/image/get/" + filename})
	}
	catch (e){
		console.log("Error upload image: " + e);
		res.status(500).send({error: e})
	}
}

exports.insert_fake_picture_test = async (filename, username) => {
	console.log("Uploading fake image")
	try {
		let insert_query = db.query(
			"INSERT INTO PICTURES \
				(url, user) \
				VALUES (?, ?);",

			["http://13.38.118.106:80/api/image/get/" + filename, req.username])

		return ("http://13.38.118.106:80/api/image/get/" + filename)
	}
	catch (e){
		throw(e)
	}
}