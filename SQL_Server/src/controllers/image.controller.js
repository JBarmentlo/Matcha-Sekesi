const db = require("../db/sql.conn");

exports.upload_image = async (req, res) => {
	console.log("Uploading image")
	try {
		let filename = req.file.filename
		console.log('filename: ', req.file.filename, 'User: ', req.username)
		let insert_query = db.query(
			"INSERT INTO PICTURES \
				(url, user) \
				VALUES (?, ?);",
			
			["http://localhost:8081/images/get/" + filename, req.username])
		
		res.status(200).send({'filename': filename})
	}
	catch (e){
		res.status(500).send({error: e})
	}
}
