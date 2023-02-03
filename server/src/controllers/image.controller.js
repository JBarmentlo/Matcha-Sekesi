const db = require("../db/sql.conn");

const hostname=`${process.env.MATCHA_HOST}${process.env.MATCHA_DEFAULT_PORT == '80' || process.env.MATCHA_DEFAULT_PORT == '443' ? '' : ':' + process.env.MATCHA_DEFAULT_PORT}`


exports.upload_image = async (req, res) => {
	console.log("Uploading image")
	try {
		let filename = req.file.filename
		console.log('filename: ', req.file.filename, 'User: ', req.username)
		res.status(200).send({'filename': filename, url: `${hostname}/api/image/get/${filename}`})
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

			[`${hostname}/api/image/get/${filename}`, req.username])

		return (`${hostname}/api/image/get/${filename}`)
	}
	catch (e){
		// throw(e)
	}
}