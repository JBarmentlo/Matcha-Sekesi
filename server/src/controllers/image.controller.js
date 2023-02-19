const db = require("../db/sql.conn");

const back_hostname = require('../fixtures/hostname.js').back_hostname


exports.upload_image = async (req, res) => {
	console.log("Uploading image")
	try {
		let filename = req.file.filename
		console.log('filename: ', req.file.filename, 'User: ', req.username)
		res.status(200).send({'filename': filename, url: `${back_hostname}/api/image/get/${filename}`, code: "SUCCESS"})
	}
	catch (e){
		console.log("Error upload image: " + e);
		res.status(500).send({error: e, code: "FAILURE"})
	}
}

exports.insert_fake_picture_test = async (filename, username) => {
	console.log("Uploading fake image")
	try {
		let insert_query = db.query(
			"INSERT INTO PICTURES \
				(url, user) \
				VALUES (?, ?);",

			[`${back_hostname}/api/image/get/${filename}`, req.username])

		return (`${back_hostname}/api/image/get/${filename}`)
	}
	catch (e){
		return 'lol'
	}
}