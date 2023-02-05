const db = require("../db/sql.conn");

exports.check_mailverified = async (req, res, next) => {
    console.log("Checking mail has been verified for ", req.username)
    try {
        let mail_verified_query = await db.query(
            `
            SELECT
                1
            FROM
                VERIFIEDMAIL
            WHERE
                user='jhonny'
            `,
            [req.username])
        console.log("got:", mail_verified_query, mail_verified_query.length)
        if (mail_verified_query.length == 1) {
            return next()
        }
        else {
            return res.status(401).send({message: `You are not authorized to perform this action: ${req.url}, please validate your mail`, code: 'NON_VALIDATED_MAIL'})
        }
    }
    catch (e) {
        throw(e)
        return res.status(401).send({message: "You are not authorized to perform this action. mail."})
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
                    not (ISNULL(profilePic) OR is_verified_mail = 0 OR JSON_LENGTH(tag_list) = 0 OR LENGTH(bio) = 0) as is_complete_profile
                FROM
                    USERS
                LEFT JOIN VALIDMAIL
                    ON USERS.username = VALIDMAIL.username
                LEFT JOIN TAG_LIST
                    ON USERS.username = TAG_LIST.user
            )

            SELECT
                is_complete_profile
            FROM
                COMPLETEPROFILE
            WHERE
                username = ?
            `,
            [req.username])
        console.log("got:", profile_complete_query, profile_complete_query.length)
        if (profile_complete_query.length == 1 && profile_complete_query[0].is_complete_profile) {
            return next()
        }
        else {
            return res.status(401).send({message: `You are not authorized to perform this action ${req.url}, please complete your profile`, code: 'INCOMPLETE_PROFILE'})
        }
    }
    catch (e) {
        throw(e)
        return res.status(401).send({message: "You are not authorized to perform this action. profile."})
    }
}
