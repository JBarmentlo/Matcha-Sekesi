const axios    = require('axios');
const db       = require("../db/sql.conn");
const bcrypt   = require("bcryptjs");
const crypto   = require('crypto');
const jwt      = require("jsonwebtoken");

const sendMail = require('../services/mailgun');
const searches = require("./user.request.js")


async function get_42_user_details(bearer_token) {
    console.log("TOKEEEEN: ", bearer_token)
	let request = {
		url: `https://api.intra.42.fr/v2/me`,
		method: "get",
		headers: {
			"Content-type": "application/json",
            'Accept-Encoding': 'identity',
            Authorization : `Bearer ${bearer_token}`
		}
	};
	const response = await axios(request);
	return response;
}

async function get_42_user_token(code) {
	let request = {
		url: `https://api.intra.42.fr/oauth/token`,
		method: "post",
		headers: {
			"Content-type": "application/json",
            'Accept-Encoding': 'application/json'
		},
        params : {
            grant_type: 'authorization_code',
            client_id: process.env.OAUTH_ID,
            client_secret: process.env.OAUTH_SECRET,
            redirect_uri: 'https://matcha.yoopster.com/api/auth/oauth/',
            code: code
        }
	};
	const response = await axios(request);
	return response;
}

async function create_user(user_info) {
    console.log('Creating Oauth user', user_info)

    email      = user_info.email,
    id         = user_info.id,
    login      = user_info.login,
    first_name = user_info.first_name,
    last_name  = user_info.last_name,
    image      = user_info.image


    try {
        let query_result = await db.query(
            'INSERT INTO USERS (username, mail , firstName , lastName , zipCode, longitude, latitude, city, profilePic)\
                        VALUES (?       , ?    , ?         , ?        , ?      , ?        , ?       , ?   , ?)',
                               [login   , email, first_name, last_name, 75018  , 0.0      , 0.0     , 'Paris', image]
            )

        let hash = bcrypt.hashSync(query_result.insertId.toString(), 8)

        let insert_mail_result = await db.query(
            "INSERT INTO VERIFY \
            (user, id_hash) \
            VALUES (?, ?);",
            [login, hash]
        )
        sendMail(email, "Verify your email", "Please validate your email here: " + "https://matcha.yoopster.com/verify/" + encodeURIComponent(hash))

        let insert_42_result = await db.query(
            "INSERT INTO Oauth42 \
            (id_42, username) \
            VALUES (?, ?);",
            [id, login]
        )
        return login
    }
    catch (e) {
        if (e.code == 'ER_DUP_ENTRY') {
            console.log("in err dup")
            if (e.sqlMessage.includes('USERS.USERS_mail_uindex')) {
                return 'mail_already_taken'
            }

            else if (e.sqlMessage.includes('USERS.USERS_username_uindex')) {
                user_info.login = user_info.login + '_'
                return create_user(user_info)
            }
        }
        throw(e)
        return false
    }	
};

async function does_user_already_exist(user_id) {
    let insert_mail_result = await db.query(
        "SELECT username FROM Oauth42 \
        WHERE id_42=?",
        user_id
    )
    console.log(insert_mail_result)
    if (insert_mail_result.length == 1) {
        return insert_mail_result[0].username
    }
    return null
}

async function create_signin_data(username) {
    try {
        console.log("oauth signing in %s", username)
        let user = await searches.get_my_user(username)
        if (user == undefined) {
            throw("undefined user wtf")
        }

        const { privateKey, publicKey } = crypto.generateKeyPairSync('ec', {
            namedCurve: 'sect239k1'
        });
    
        const sign = crypto.createSign('SHA256');
        sign.write(`${user}`);
        sign.end();
        var signature = sign.sign(privateKey, 'hex');
        // console.log("signature")
        // console.log(signature)
    
        // sign username
        var token = jwt.sign({ username: user.username }, signature, {
            expiresIn: 86400 // 24 hours
        });
        // console.log("signed in: ", user)
        return {
            user       : user,
            accessToken: token,
            signature  : signature,
            code       : "SUCCESS"
        }
    }
    catch (e) {
        console.error("ERROR in OAUTH signin")
        throw (e)
    }
 
};

exports.oauthInUp = async (req, res) => {
    console.log('Oauth for codeee: ', req.query.code)
    let token42 = await get_42_user_token(req.query.code)
    if (token42.status == 200) {
        let user_details = await get_42_user_details(token42.data.access_token)
        if (user_details.status == 200) {
            user_info = {
                email     : user_details.data.email,
                id        : user_details.data.id,
                login     : user_details.data.login,
                first_name: user_details.data.first_name,
                last_name : user_details.data.last_name,
                image     : user_details.data.image.link
            }
            console.log(user_info)
            let existing_username = await does_user_already_exist(user_info.id)
            let user_exists = (existing_username != null)

            if (!user_exists) {
                existing_username = await create_user(user_info)
                console.log('user_created: ', existing_username)
            }

            if (existing_username == 'mail_already_taken') {
                return res.redirect(`/forgotpassword/taken`)
            }

            let signin = await create_signin_data(existing_username)
            res.cookie("user", JSON.stringify(signin.user))
            console.log(("user", JSON.stringify({...signin.user})))
            res.cookie("sekes_tokens",  JSON.stringify({accessToken: signin.accessToken, signature: signin.signature}))
            console.log("sekes_tokens",  JSON.stringify({accessToken: signin.accessToken, signature: signin.signature}))

            return res.redirect("/editprofile");
        }
    }
};
// 401 forbidden
// data: {
//     error: 'invalid_grant',
//     error_description: 'The provided authorization grant is invalid, expired, revoked, does not match the redirection URI used in the authorization request, or was issued to another client.'
//   }

// 429 rate exceeded
// data: '429 Too Many Requests (Rate Limit Exceeded)'
//  TOKEN was undefined ????


