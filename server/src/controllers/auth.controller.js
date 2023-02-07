const bcrypt   = require("bcryptjs");
const crypto   = require('crypto');
const jwt      = require("jsonwebtoken");

const sendMail = require('../services/mailgun');
const db       = require("../db/sql.conn");
const new_searches = require("./user.request.js")
const hostname = require('../fixtures/hostname.js').hostname
const { nanoid } = require("nanoid");

exports.signup = async (req, res) => {
    console.log('Signup for users: ', req.body.username)
    let username  = req.body.username;
    let firstName = req.body.firstName;
    let lastName  = req.body.lastName;
    let mail      = req.body.mail;
    let password  = bcrypt.hashSync(req.body.password, 8);
    let zipCode   = req.body.zipCode;
    let city      = req.body.city;
    let latitude  = req.body.latitude;
    let longitude = req.body.longitude;

    try {
        let query_result = await db.query(
            `INSERT INTO USERS (username, mail, firstName, lastName, password, zipCode, longitude, latitude, city) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [username, mail, firstName, lastName, password, zipCode, longitude, latitude, city]
            )
        let hash = nanoid(48);
        await db.query(
            "INSERT INTO VERIFY \
            (user, id_hash, mail) \
            VALUES (?, ?, ?);",
            [username, hash, mail]
        )
        
        sendMail(mail, "Verify your email", `Dear ${username},\n\nPlease validate your email here: ${hostname}/verify/${encodeURIComponent(hash)} `)
        console.log(mail, "Verify your email", `Dear ${username},\n\nPlease validate your email here: \n${hostname}/verify/${encodeURIComponent(hash)} `)
        return res.status(200).send({message: 'Succesfully created user', id: query_result.insertId, code: "SUCCESS", hash: hash})
    }
    catch (e) {
        console.log(e)
        if (e.code == 'ER_DUP_ENTRY') {
            return res.status(200).send({message: e.sqlMessage, code: e.code, sqlMessage: e.sqlMessage})
        }
        else if (e.code == 'ER_PARSE_ERROR') {
            return res.status(400).send({message: 'There was an error parsing your request', code: e.code, sqlMessage: e.sqlMessage})
            // // throw(e)
        }
        else if (e.code == 'ER_DATA_TOO_LONG') {
            return res.status(200).send({message: "Data too long", code: e.code, sqlMessage: e.sqlMessage})
        }
        else if (e.code == 'ER_BAD_NULL_ERROR') {
            return res.status(200).send({message: "data columns cant be null", code: e.code, sqlMessage: e.sqlMessage})
        }
        else {
            console.log("signup error:\n", e, "\nend signup error")
            return res.status(403).send({message: 'error in create test user', error: e, code: 'FAILURE'})
            // throw(e)
        }
    }	
};

exports.verifyMail = async (req, res) => {
    try {
        console.log("verifying mail. hash: ", req.params.hash)
        let verify_mail_result = await db.query(
            `SELECT * FROM VERIFY
            where id_hash=?`,
            req.params.hash)
        
    
        if (verify_mail_result.length == 0) {
            return res.status(200).send({message: "No user for the mail verif", code: "MISSING_VERIFY"})
        }

        await db.query(
            "DELETE FROM VERIFY \
            where id_hash=?",
            req.params.hash)

        await db.query(`
            INSERT INTO VERIFIEDMAIL (user, mail)
                VALUES (?, ?)`,
            [verify_mail_result[0].user, verify_mail_result[0].mail])

        return res.status(200).send({message: "verified mail for " + verify_mail_result[0].user, code: "SUCCESS"})
    }
    catch (e) {
        return res.status(200).send({message: "Error in verify mail", code: "Failure"})
        throw (e)
    }
};

exports.requestresetPass = async (req, res) => {
    console.log("requesting reset psw for mail %s", req.body.mail)
    
    try {
        let user_request = await db.query(
            "SELECT username, id from USERS WHERE USERS.mail=?",
            req.body.mail)

        if (user_request.length == 0) {
            console.log("MISSING: ", user_request)
            return res.status(200).send({message: "No user for the reset request", code: "MISSING_RESET"})
        }

        let user = user_request[0]
        let hash = nanoid(48);
        await db.query(
            "INSERT INTO RESET \
            (user, id_hash) \
            VALUES (?,?);",
            [user.username, hash]
        )
        sendMail(req.body.mail, "Sekesi Password Reset",  "Click here to reset password: " + `${hostname}/reset/${encodeURIComponent(hash)}`)
        return res.status(200).send({message: "Sucessfully requested reset", code: "SUCCESS", hash: hash})
    }
    catch (e) {
        console.log("error in request reset")
        return res.status(400).send({message: "Error in requested reset", code: "FAILURE"})
        throw (e)
    }
};

exports.resetPass = async (req, res) => {
    try {
        console.log("resetting password")
        let verify_reset_result = await db.query(
            "SELECT * FROM RESET \
            where id_hash=?",
            req.body.hash)
        if (verify_reset_result.length == 0) {
            // console.log("return res.status(201).send({message: 'No user for the reset', code: 'MISSING_VERIFY'})")
            return res.status(201).send({message: "No user for the reset", code: "MISSING_VERIFY"})
        }
        let delete_reset_result = await db.query(
            "DELETE FROM RESET \
            where id_hash=?",
            req.body.hash)
        if ((Date.now() - verify_reset_result[0].last_updated) > 600000) {
            // console.log("return res.status(201).send({message: 'Code Timed out', code: 'TIMEOUT_RESET'})")
            return res.status(201).send({message: "Code Timed out", code: "TIMEOUT_RESET"})
        }
    let password_hash  = bcrypt.hashSync(req.body.password, 8);
        let verify_user_result = await db.query(
            "UPDATE USERS SET password=? WHERE USERS.username=?",
            [password_hash, verify_reset_result[0].user]
        )
        // console.log("return res.status(200).send({message: 'reset pass for ' + verify_reset_result[0].user, code: 'SUCCESS'})")
        return res.status(200).send({message: "reset pass for " + verify_reset_result[0].user, code: "SUCCESS"})
    }
    catch (e) {
        console.log("error in reset Pass: ",e)
        return res.status(200).send({message: "Error in reset pass", code: "Failure"})
        throw (e)
    }
};

exports.signin = async (req, res) => {
    try {
        console.log("signing in %o", req.body)
        let user = await new_searches.get_my_user(req.body.username)
        if (user == null || user == undefined) {
            return res.status(201).send({message: "user doesnt exist", code: "MISSING_USERNAME"})
        }
        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) {
            return res.status(201).send({ accessToken: null, message: "Invalid Password!", code: "WRONG_PASSWORD" });
        }
    
        // sign username
        var token = jwt.sign({ username: user.username }, process.env.SIGNATURE, {
            expiresIn: 86400 // 24 hours
        });
        // console.log("signed in: ", user)
        res.status(200).send({
            user       : user,
            accessToken: token,
            signature: "hehe_no_security_flaw",
            code       : "SUCCESS"
        });
    }
    catch (e) {
        console.error("ERROR in signin", e)
        return res.status(400).send({message: "Error in signin", code: "Failure"})
        throw (e)
    }
};

exports.verifyToken = (req, res, next) => {
    try {
        let token = req.headers["x-access-token"];
        if (!token) {
            return res.status(403).send({ message: "No token provided!" });
        }
        
        jwt.verify(token, process.env.SIGNATURE, (err, decoded) => {
            if (err) {
                console.log("error in decode: ", err)
                return res.status(401).send({ message: "Unauthenticated!" });
            }
            req.username = decoded.username;
            return next();
        });
    }
    catch (e) {
        console.log('error in verify token', e)
        return res.status(401).send({ message: "Unauthorizedd!" });
    }
};

exports.updateLastConnected = async (req, res, next) => {
    try {
        // console.log("Updating last connected: ", req.username)
        
       await db.query(
            "UPDATE USERS\
            SET last_connected = CURRENT_TIMESTAMP\
            WHERE username= ?;",
            req.username)
        return next();
    }
    catch (e) {
        console.log('error in update co')
        // console.log(e)
        // throw(e)
    }

};