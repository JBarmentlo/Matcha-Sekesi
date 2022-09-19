
exports.search_users = async (req, res) => {
	// TODO add groupby maybe
	try {
		let [rows, fields] = await db.query(
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
				IF((? IN(SELECT liked FROm LIKES where liker = ?)),1,0) as did_i_like_him \
			FROM USERS                                                                    \
				LEFT JOIN TAGS T                                                          \
				on USERS.username = T.user                                                \
			WHERE username=?                                                              \
			GROUP BY username;"
							  
		, req.body.username, req.username)
		res.status(200).send({message: 'Successfully queried users.', data: rows})
	}
	catch (e) {
		console.log("get user by name error:\n", e, "\nend error")
		res.status(500).send({message: 'error in get users', error: e})
		throw(e)
	}	
}




