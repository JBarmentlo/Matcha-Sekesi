const db                = require("../db/sql.conn");
const bcrypt            = require("bcryptjs");
const sinon             = require('sinon');
const cliProgress       = require('cli-progress');
const bar1              = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
const likeController    = require("../controllers/like.controller")
const consultController = require("../controllers/consult.controller")
const blockController   = require("../controllers/block.controller")

const mockResponse = () => {
	const res = {};
	res.status = sinon.stub().returns(res);
	res.json = sinon.stub().returns(res);
	res.send = sinon.stub()
	return res;
};

const mockRequest = (body, username) => {
	return {
		username: username,
		body: body
	};
};


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
        if (process.env.ENVIRONMENT == 'TEST') {
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
	gif               = req.body.gif
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

	// console.log("\n\n\n\n\n\n\nusername: ", username, "\nfirstName: ", firstName, "\nlastName: ", lastName, "\ntag_list: ", tag_list, "\nmail: ", mail, "\npassword: ", "\npopScore: ", popScore, "\nzipCode: ", zipCode, "\ncity: ", city, "\nisCompleteProfile: ", isCompleteProfile, "\nlongitude: ", longitude, "\nlatitude: ", latitude, "\nDOB: ", DOB, "\nimage0: ", image0, "\nprofilePic: ", profilePic)
	try {
		await db.query(
			'INSERT INTO USERS \
			(username, firstName, lastName, bio, mail, password, mailVerified, gender, sekesualOri, popScore, zipCode, city, isCompleteProfile, longitude, latitude, image0, profilePic, DOB, gif) \
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
			[username, firstName, lastName, bio, mail, password, mailVerified, gender, sekesualOri, popScore, zipCode, city, isCompleteProfile, longitude, latitude, image0, profilePic, DOB, gif]
			)
		let keri_string ="INSERT INTO TAGS (tag, user) VALUES "
		for (const tag of tag_list) {
			keri_string += ` ('${tag}', '${username}'),`
		}
		keri_string = keri_string.slice(0, -1)
		let keri_res = 'Did not meet criteria'
		if (tag_list.length != 0) {
			keri_res = await db.query(keri_string)
		}
		console.log("Created user: ", username)
		return res.status(200).send({message: 'Succesfully created user', code: 'SUCCESS', user: keri_res})
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
			// console.log("create user test error:\n", e, "\n\nend signup error")
			return res.status(200).send({message: "Error in populate", code: 'FAIL_OK'})
			throw(e)
		}
	}	
};


exports.get_user_list = async (req, res) => {
	try {
		let user_list = await db.query(
			"SELECT username from USERS;"
		)
		res.status(200).send({message: 'Succesfully added tag to user', code: "SUCCESS", data: user_list})
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
};


exports.create_likes = async (req, res) => {
	console.log("Creating likes")
	let like_list = req.body.like_list
	bar1.start(like_list.length, 0);
	let i = 0
	let mock_res = mockResponse()
	try {
		for (const like of like_list) {
			bar1.update(i)
			i += 1
			req.username = like.liker.username
			req.body.liked = like.liked.username
			let like_res = await likeController.like_user(req, mock_res)
		}
		bar1.stop();
		console.log("Created likes")
		return res.status(200).send({message: 'Succesfully created likes', code: 'SUCCESS'})
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
			console.log("create user likes test error:\n", e, "\n\nend error")
			return res.status(200).send({message: "Error in populate", code: 'FAIL_OK'})
			throw(e)
		}
	}	
};


exports.create_consults = async (req, res) => {
	console.log("Creating consults")
	let consult_list = req.body.consult_list
	bar1.start(consult_list.length, 0);
	let mock_res = mockResponse()
	let i = 0
	try {
		for (const consult of consult_list) {
			bar1.update(i)
			i += 1
			req.username = consult.consulter.username
			req.body.consulted = consult.consulted.username
			let consult_res = await consultController.consult_user(req, mock_res)
		}
		bar1.stop();
		console.log("Created consults")
		return res.status(200).send({message: 'Succesfully created consults', code: 'SUCCESS'})
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
			console.log("create user consults test error:\n", e, "\n\nend error")
			return res.status(200).send({message: "Error in populate", code: 'FAIL_OK'})
			throw(e)
		}
	}	
};


exports.create_blocks = async (req, res) => {
	console.log("Creating blocks")
	let block_list = req.body.block_list
	bar1.start(block_list.length, 0);
	let i = 0
	try {
		for (const block of block_list) {
			bar1.update(i)
			i += 1
			req.username = block.blocker.username
			req.body.blocked = block.blocked.username
			let mock_res = mockResponse()
			let block_res = await blockController.block_user(req, mock_res)
		}
		bar1.stop();
		console.log("Created blocks")
		return res.status(200).send({message: 'Succesfully created blocks', code: 'SUCCESS'})
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
			console.log("create user blocks test error:\n", e, "\n\nend error")
			return res.status(200).send({message: "Error in populate", code: 'FAIL_OK'})
			throw(e)
		}
	}	
};
