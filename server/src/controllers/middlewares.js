const db = require("../db/sql.conn");

exports.check_mailverified = async (req, res, next) => {
    console.log("Checking mail has been verified for ", req.body.username)
    try {
        let mail_verified_query = await db.query(
            `
            SELECT
                username,
                NOT ISNULL(VERIFIEDMAIL.mail) as is_verified
            FROM
                USERS LEFT JOIN VERIFIEDMAIL
                ON USERS.username = VERIFIEDMAIL.user
            WHERE
                username=?
            `,
            [req.body.username])
        console.log("got:", mail_verified_query, mail_verified_query.length)

        if (mail_verified_query.length == 1 && !mail_verified_query[0].is_verified) {
            return res.status(202).send({message: `You are not authorized to perform this action: ${req.url}, please validate your mail`, code: 'NON_VALIDATED_MAIL'})
        }
        return next()
    }
    catch (e) {
        throw(e)
        return res.status(202).send({message: "You are not authorized to perform this action. mail."})
    }
}


exports.check_profile_complete = async (req, res, next) => {
    console.log("Checking profile is complete for ", req.username)
    try {
        let profile_complete_query = await db.query(
            `
            WITH
            VALIDMAIL as (
                SELECT
                    username,
                    COUNT(VERIFIEDMAIL.mail) as is_verified_mail
                FROM
                    USERS
                        LEFT JOIN VERIFIEDMAIL
                            ON USERS.username = VERIFIEDMAIL.user
                GROUP BY USERS.username
            ),

            TAG_LIST as (
                SELECT
                    user,
                    JSON_ARRAYAGG(tag) as tag_list
                FROM
                    TAGS
                GROUP BY
                    user
            ),

            COMPLETEPROFILE AS (
                SELECT
                    USERS.username,
                    ISNULL(profilePic) as no_profile_pic,
                    is_verified_mail = 0 as no_verified_mail,
                    JSON_LENGTH(tag_list) = 0 as no_tags,
                    LENGTH(bio) = 0 as no_bio,
                    not (ISNULL(profilePic) OR is_verified_mail = 0 OR JSON_LENGTH(tag_list) = 0 OR LENGTH(bio) = 0) as is_complete_profile
                FROM
                    USERS
                LEFT JOIN VALIDMAIL
                    ON USERS.username = VALIDMAIL.username
                LEFT JOIN TAG_LIST
                    ON USERS.username = TAG_LIST.user
            )

            SELECT
                is_complete_profile,
                no_profile_pic,
                no_verified_mail,
                no_tags,
                no_bio
            FROM
                COMPLETEPROFILE
            WHERE
                username = ?
            `,
            [req.username])
        console.log("got:", profile_complete_query)
        if (profile_complete_query.length == 1 && profile_complete_query[0].is_complete_profile) {
            return next()
        }
        else {
            return res.status(202).send({message: `You are not authorized to perform this action ${req.url}, please complete your profile`, code: 'INCOMPLETE_PROFILE'})
        }
    }
    catch (e) {
        throw(e)
        return res.status(202).send({message: "You are not authorized to perform this action. profile."})
    }
}

function isEmail(email) {
    var emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (email !== '' && email.match(emailFormat)) { return true; }
    
    return false;
}

function isValidPassword(pass) {
    var passFormat = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    if (pass !== '' && pass.match(passFormat)) { return true; }
    
    return false;
}


function isString(val) {
    return (typeof val === 'string' || val instanceof String) 
}

exports.validate_signup_form = async (req, res, next) => {
    try {
        let username  = req.body.username;
        let firstName = req.body.firstName;
        let lastName  = req.body.lastName;
        let mail      = req.body.mail;
        let password  = req.body.password;
        let zipCode   = req.body.zipCode;
        let city      = req.body.city;
        let latitude  = req.body.latitude;
        let longitude = req.body.longitude;

        console.log(!isEmail(mail), username.length < 5, !isString(firstName), !isString(lastName), !isString(city), isNaN(longitude), isNaN(latitude))

        if (!isEmail(mail) || username.length < 5 || !isString(firstName) || !isString(lastName) || !isString(city) || isNaN(longitude) || isNaN(latitude)) {
            return res.status(202).send({message: "invalid signup form", code: "INVALID_FORM"})
        }
        console.log(!isValidPassword(password))
        if (!isValidPassword(password)) {
            return res.status(202).send({message: "invalid signup password", code: "INVALID_FORM"})
        }
        return next()
    }
    catch (e) {
        console.log("error in validate signup")
        throw(e)
        res.status(202).send({message: "invalid signup formm", code: "INVALID_FORM"})
    }
}

exports.validate_update_form = async (req, res, next) => {
    try {
        let firstName = req.body.update.firstName;
        let lastName  = req.body.update.lastName;
        let mail      = req.body.update.mail;

        console.log(!isEmail(mail), !isString(firstName))

        if (!isEmail(mail) || !isString(firstName) || !isString(lastName)) {
            return res.status(202).send({message: "invalid update form", code: "INVALID_FORM"})
        }
        return next()
    }
    catch (e) {
        console.log("error in validate update")
        throw(e)
        res.status(202).send({message: "invalid signup formm", code: "INVALID_FORM"})
    }
}