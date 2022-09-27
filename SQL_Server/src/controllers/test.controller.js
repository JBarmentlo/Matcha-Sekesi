const db   = require("../db/sql.conn");
var bcrypt = require("bcryptjs");

exports.clear_db = () => {
	let promise_BLOCKS   = db.query('DELETE FROM BLOCKS;')
	let promise_CONSULTS = db.query('DELETE FROM CONSULTS;')
	let promise_LIKES    = db.query('DELETE FROM LIKES;')
	let promise_TAGS     = db.query('DELETE FROM TAGS;')
	let promise_USERS    = db.query('DELETE FROM USERS;')
	let promise_VERIFY   = db.query('DELETE FROM VERIFY;')
	return Promise.all([promise_BLOCKS ,promise_CONSULTS ,promise_LIKES ,promise_TAGS ,promise_USERS ,promise_VERIFY])
}


exports.verifyTestModeOn = (req, res, next) => {
    try {
        if (process.env.TEST == 'true') {
            next();
        }
        else {
            console.error("Tried to access test endpoints")
            res.status(201).send({"message": "Only avalable for testing"})
        }
    }
    catch (e) {
        console.log('error in verify test on')
    }
};


exports.create_user_test = async (req, res) => {

	username          = req.body.username
	firstName         = req.body.firstName
	lastName          = req.body.lastName
	bio               = req.body.bio
	mail              = req.body.mail
	password          = bcrypt.hashSync(req.body.password, 8),
	mailVerified      = req.body.mailVerified
	gender            = req.body.gender
	sekesualOri       = req.body.sekesualOri
	popScore          = req.body.popScore
	zipCode           = req.body.zipCode
	city              = req.body.city
	isCompleteProfile = req.body.isCompleteProfile
	longitude         = req.body.longitude
	latitude          = req.body.latitude
	DOB               = req.body.DOB
	image0            = req.body.image0
	profilePic        = req.body.profilePic
	tag_list          = req.body.tag_list

	if (tag_list == undefined || tag_list == null) {
		tag_list = []
	}

	console.log("\n\n\n\n\n\n\nusername: ", username, "\nfirstName: ", firstName, "\nlastName: ", lastName, "\ntag_list: ", tag_list, "\nmail: ", mail, "\npassword: ", "\npopScore: ", popScore, "\nzipCode: ", zipCode, "\ncity: ", city, "\nisCompleteProfile: ", isCompleteProfile, "\nlongitude: ", longitude, "\nlatitude: ", latitude, "\nDOB: ", DOB, "\nimage0: ", image0, "\nprofilePic: ", profilePic)
	try {
		await db.query(
			'INSERT INTO USERS \
			(username, firstName, lastName, bio, mail, password, mailVerified, gender, sekesualOri, popScore, zipCode, city, isCompleteProfile, longitude, latitude, image0, profilePic, DOB) \
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, DOB)',
			[username, firstName, lastName, bio, mail, password, mailVerified, gender, sekesualOri, popScore, zipCode, city, isCompleteProfile, longitude, latitude, image0, profilePic, DOB]
			)
		let keri_string ="INSERT INTO TAGS (tag, user) VALUES "
		for (const tag of tag_list) {
			keri_string += ` ('${tag}', '${username}'),`
		}
		keri_string = keri_string.slice(0, -1)
		if (tag_list.length != 0) {
			await db.query(keri_string)
		}
		console.log("Created user: ", username)
		return res.status(200).send({message: 'Succesfully created user', code: 'SUCCESS'})
	}
	catch (e) {
		if (e.code == 'ER_DUP_ENTRY') {
			return res.status(200).send({message: e.sqlMessage, code: e.code, sqlMessage: e.sqlMessage})
		}
		else if (e.code == 'ER_PARSE_ERROR') {
			return res.status(400).send({message: 'There was an error parsing your request', code: e.code, sqlMessage: e.sqlMessage})
			// throw(e)
		}
		else if (e.code == 'ER_DATA_TOO_LONG') {
			return res.status(200).send({message: "Data too long", code: e.code, sqlMessage: e.sqlMessage})
		}
		else if (e.code == 'ER_BAD_NULL_ERROR') {
			return res.status(200).send({message: "data columns cant be null", code: e.code, sqlMessage: e.sqlMessage})
		}
		else {
			console.log("create user test error:\n", e, "\n\nend signup error")
			return res.status(200).send({message: "Error in populate", code: 'FAIL_OK'})
			throw(e)
		}
	}	
};


exports.create_user_tags= async (req, res) => {
	let username = req.body.username
	let tag_list = req.body.tag_list

	try {
		let keri_string ="INSERT INTO TAGS (tag, user) VALUES "
		for (const tag of tag_list) {
			keri_string += ` ('${tag}', '${username}'),`
		}
		keri_string = keri_string.slice(0, -1)
		console.log("KERI TAG: ", keri_string)
		if (tag_list.length != 0) {
			await db.query(keri_string)
		}
		res.status(200).send({message: 'Succesfully added tag to user', code: "SUCCESS"})
	}
	catch (e) {
		if (e.code == 'ER_DUP_ENTRY') {
			res.status(200).send({message: "Duplicate tag", code: e.code, sqlMessage: e.sqlMessage})
		}
		else if (e.code == 'ER_DATA_TOO_LONG') {
			res.status(200).send({message: "Data too long", code: e.code, sqlMessage: e.sqlMessage})
		}
		else if (e.code == 'ER_NO_REFERENCED_ROW') {
			res.status(200).send({message: "User doesnt exist", code: e.code, sqlMessage: e.sqlMessage})
		}
		else if (e.code == 'ER_NO_REFERENCED_ROW_2') {
			res.status(200).send({message: "User name not existing", code: e.code})
		}
		else if (e.code == 'ER_BAD_NULL_ERROR') {
			res.status(200).send({message: "User doesnt exist", code: e.code, sqlMessage: e.sqlMessage})
		}
		else if (e.code == 'ER_PARSE_ERROR') {
			res.status(500).send({message: "Parsing error when liking.", error: e, code: 'FAILURE', sqlMessage: e.sqlMessage})
			throw (e)
		}
		else {
			console.log("EROOL: ", e)
			res.status(500).send({message: "Error in like user ", error: e})
			throw(e)
		}
	}
}

