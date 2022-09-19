const db       = require("../db/sql.conn");


exports.get_all_users = async (req, res) => {
	console.log("getting all users relative to: ", req.username)
	try {
		let user_query = await db.query(
			"SELECT                                                                       \
				username,                                                                 \
				firstName,                                                                \
				lastName,                                                                 \
				bio,                                                                      \
				mail,                                                                     \
				password,                                                                 \
				mailVerified,                                                             \
				gender,                                                                   \
				sekesualOri,                                                              \
				popScore,                                                                 \
				zipCode,                                                                  \
				city,                                                                     \
				isCompleteProfile,                                                        \
				longitude,                                                                \
				latitude,                                                                 \
				id,                                                                       \
				GROUP_CONCAT(tag) as tag_list,                                            \
				IF((username IN(SELECT liked FROM LIKES where liker = ?)),1,0) as did_i_like_him \
			FROM USERS                                                                    \
				LEFT JOIN TAGS T                                                          \
				on USERS.username = T.user                                                \
			GROUP BY username                                                             \
			LIMIT 10;"
							  
		, req.username)
		console.log("Rows: ", user_query.map(user => user.username))
		res.status(200).send({message: 'Successfully queried users.', data: user_query})
	}
	catch (e) {
		console.log("get user by name error:\n", e, "\nend error")
		res.status(500).send({message: 'error in get users', error: e})
		throw(e)
	}	
}




