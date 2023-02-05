const db = require("../db/sql.conn");

exports.mailverified = async (req, res, next) => {
    try {
        let mail_verified_query = await db.query(
            `
            SELECT
                1
            FROM
                VERIFIEDMAIL
            WHERE
                user=?
            `,
            [req.username])
        console.log(mail_verified_query)
    }
    catch (e) {
        throw(e)
        return res.status(401).send({message: "You are not authorized to perform this action."})
    }
    
}
