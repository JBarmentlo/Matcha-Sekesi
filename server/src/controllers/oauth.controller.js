const axios    = require('axios');
const db       = require("../db/sql.conn");
const bcrypt   = require("bcryptjs");
const crypto   = require('crypto');
const jwt      = require("jsonwebtoken");

const sendMail = require('../services/mailgun');
const new_searches = require("./user.request.js")


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

const hostname = require('../fixtures/hostname.js').hostname

async function create_user(user_info) {
    // TODO FIX THIS BULLSHIT
    console.log('Creating Oauth user', user_info)

    email      = user_info.email,
    id         = user_info.id,
    login      = user_info.login,
    first_name = user_info.first_name,
    last_name  = user_info.last_name,
    image      = user_info.image
    long       = user_info.long
    lat        = user_info.lat


    try {
        let query_result = await db.query(
            'INSERT INTO USERS (username, mail , firstName , lastName , zipCode, longitude, latitude, city, profilePic)\
                        VALUES (?       , ?    , ?         , ?        , ?      , ?        , ?       , ?   , ?)',
                               [login   , email, first_name, last_name, 75018  , long     , lat     , 'Paris', image]
            )

        let hash = bcrypt.hashSync(query_result.insertId.toString(), 8)

        let insert_mail_result = await db.query(
            "INSERT INTO VERIFY \
            (user, id_hash) \
            VALUES (?, ?);",
            [login, hash]
        )
        sendMail(email, "Verify your email", `Please validate your email here: ${hostname}/verify/${encodeURIComponent(hash)}`)

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
        // throw(e)
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
        let user = await new_searches.get_my_user(username)
        if (user == null) {
            throw("undefined user wtf")
        }

        var token = jwt.sign({ username: user.username }, process.env.SIGNATURE, {
            expiresIn: 86400 // 24 hours
        });
        return {
            user       : user,
            accessToken: token,
            signature  : 'hehe_no_security_breach_here',
            code       : "SUCCESS"
        }
    }
    catch (e) {
        console.error("ERROR in OAUTH signin")
        throw (e)
    }
 
};

const ipInfo = require("ipinfo")
const default_ip_ret =  {
    ip      : '93.5.88.11',
    hostname: '11.88.5.93.rev.sfr.net',
    city    : 'Paris',
    region  : 'Île-de-France',
    country : 'FR',
    loc     : '48.8412,2.3003',
    org     : 'AS15557 Societe Francaise Du Radiotelephone - SFR SA',
    postal  : '75713',
    timezone: 'Europe/Paris'
  }

async function get_loc(req) {
    try {
        var forwardedIpsStr = req.header('x-forwarded-for') || req.socket.remoteAddress;
        var IP = '';
        if (forwardedIpsStr, 'e7f3e2a554658c') {
            IP = forwardedIpsStr.split(',')[0];
            IP = forwardedIpsStr.split(':');
            IP = IP.at(-1)
            let ip_ret = await ipInfo(IP)
            return ip_ret.loc.split(',')
        }
        return default_ip_ret.loc.split(',')
    }
    catch (e) {
        return default_ip_ret.loc.split(',')
    }
}

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
                let localisation = await get_loc(req)
                user_info.long = localisation[0]
                user_info.lat = localisation[1]
                existing_username = await create_user(user_info)
                console.log('user_created: ', existing_username)
            }

            if (existing_username == 'mail_already_taken') {
                return res.redirect(`/forgotpassword/taken`)
            }

            let signin = await create_signin_data(existing_username)
            // res.cookie("user", JSON.stringify(signin.user))
            // console.log(("user", JSON.stringify({...signin.user})))
            // res.cookie("sekes_tokens",  JSON.stringify({accessToken: signin.accessToken, signature: signin.signature}))
            // console.log("sekes_tokens",  JSON.stringify({accessToken: signin.accessToken, signature: signin.signature}))

            // return res.redirect("/editprofile");
            console.log("sending:\n-",signin.accessToken,"\n-",encodeURIComponent(signin.accessToken), "\n")
            return res.redirect(`/signin?oauth_token=${encodeURIComponent(signin.accessToken)}`)
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



