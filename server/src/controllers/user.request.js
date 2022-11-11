const db       = require("../db/sql.conn");

function csv_to_array(user, csv_property_name) {
	try {
		if (user[csv_property_name] === null) {
			user[csv_property_name] = []
		}
		else {
			user[csv_property_name] = user[csv_property_name].split(",")
		}
	}
	catch {
	}
	return user
	
}

function transform_csv_lists_to_arrays(user) {
	for (const property_name of ['tag_list', 'like_list', 'consult_list']) {
		user = csv_to_array(user, property_name)
	}
	return user
}

exports.get_all_users = async (searcher_username) => {
	let query = await db.query(
		"WITH MAIN AS (                                                                       \
			SELECT                                                                            \
			username,                                                                         \
			firstName,                                                                        \
			lastName,                                                                         \
			bio,                                                                              \
			mail,                                                                             \
			password,                                                                         \
			mailVerified,                                                                     \
			gender,                                                                           \
			sekesualOri,                                                                      \
			zipCode,                                                                          \
			city,                                                                             \
			isCompleteProfile,                                                                \
			longitude,                                                                        \
			latitude,                                                                         \
			id,                                                                               \
			last_connected,                                                                   \
			TIMESTAMPDIFF(SECOND , last_connected, NOW()) <= 3 as connected,                  \
			TIMESTAMPDIFF(YEAR, DOB, CURDATE()) as age,                                       \
			DOB,                                                                              \
			IF(                                                                               \
				(username IN(SELECT liked                                                     \
								FROM LIKES                                                       \
								where liker = '@searcher_username'                                           \
								)                                                                \
				), 1 , 0)                                                                     \
			as did_i_like_him,                                                                \
			GROUP_CONCAT(tag) as tag_list                                                     \
			FROM USERS                                                                        \
			LEFT JOIN TAGS T                                                                  \
			on USERS.username = T.user                                                        \
			WHERE USERS.username NOT IN (select blocked FROM BLOCKS WHERE blocker = '@searcher_username') \
			GROUP BY username),                                                               \
																								\
			MATCHES AS (                                                                      \
				SELECT l1.liker, l1.liked                                                     \
					FROM LIKES l1 INNER JOIN LIKES l2                                         \
						ON l1.liked = l2.liker                                                \
						AND l1.liker = l2.liked                                               \
						AND l1.liker != l1.liked),                                            \
																								\
			CONVO_START AS (                                                                  \
				SELECT                                                                        \
					m1.sender, m1.receiver                                                    \
				FROM                                                                          \
					MSG AS m1                                                                 \
				WHERE                                                                         \
					m1.last_updated =                                                         \
						(SELECT                                                               \
								MIN(m2.last_updated)                                             \
							FROM                                                                 \
								MSG m2                                                           \
							WHERE m1.ConvoId = m2.ConvoId))                                      \
																								\
			Select                                                                            \
				*,                                                                            \
				((Select COUNT(*) from MATCHES AS M where M.liker = U.username) / (Select COUNT(B.liker) from LIKES AS B where B.liker = U.username)) + ((Select COUNT(*) from CONVO_START AS C where C.receiver = U.username) / (Select COUNT(C.sender) + 1  from CONVO_START AS C where C.sender = U.username)) as popScore \
			From MAIN AS U;".replace(new RegExp('@searcher_username', "g"), searcher_username), )
	return query.map(user => transform_csv_lists_to_arrays(user))
};

exports.get_user = async (searcher_username, searched_username) => {
	// console.log(searcher_username, " is looking for: ", searched_username)
	let user_query = await db.query(
		"WITH MAIN AS (                                                                       \
			SELECT                                                                            \
				username,                                                                         \
				firstName,                                                                        \
				lastName,                                                                         \
				bio,                                                                              \
				mail,                                                                             \
				password,                                                                         \
				mailVerified,                                                                     \
				gender,                                                                           \
				sekesualOri,                                                                      \
				zipCode,                                                                          \
				city,                                                                             \
				isCompleteProfile,                                                                \
				longitude,                                                                        \
				latitude,                                                                         \
				id,                                                                               \
				last_connected,                                                                   \
				TIMESTAMPDIFF(SECOND , last_connected, NOW()) <= 3 as connected,                  \
				TIMESTAMPDIFF(YEAR, DOB, CURDATE()) as age,                                       \
				DOB,                                                                              \
				IF(                                                                               \
					(username IN(SELECT liked                                                     \
									FROM LIKES                                                       \
									where liker = '@searcher_username'                                           \
									)                                                                \
					), 1 , 0) as did_i_like_him,                                                                \
				IF(                                                                               \
					(username IN(SELECT blocked                                                     \
									FROM BLOCKS                                                       \
									where blocker = '@searcher_username'                                           \
									)), 1 , 0) as did_i_block_him,                                                                \
				GROUP_CONCAT(tag) as tag_list                                                     \
			FROM USERS                                                                        \
				LEFT JOIN TAGS T                                                                  \
				on USERS.username = T.user                                                        \
				WHERE USERS.username = 'searched_username' \
			GROUP BY username),                                                               \
																								\
			MATCHES AS (                                                                      \
				SELECT l1.liker, l1.liked                                                     \
					FROM LIKES l1 INNER JOIN LIKES l2                                         \
						ON l1.liked = l2.liker                                                \
						AND l1.liker = l2.liked                                               \
						AND l1.liker != l1.liked),                                            \
																								\
			CONVO_START AS (                                                                  \
				SELECT                                                                        \
					m1.sender, m1.receiver                                                    \
				FROM                                                                          \
					MSG AS m1                                                                 \
				WHERE                                                                         \
					m1.last_updated =                                                         \
						(SELECT                                                               \
								MIN(m2.last_updated)                                             \
							FROM                                                                 \
								MSG m2                                                           \
							WHERE m1.ConvoId = m2.ConvoId))                                      \
																								\
			Select                                                                            \
				*,                                                                            \
				((Select COUNT(*) from MATCHES AS M where M.liker = U.username) / (Select COUNT(B.liker) from LIKES AS B where B.liker = U.username)) + ((Select COUNT(*) from CONVO_START AS C where C.receiver = U.username) / (Select COUNT(C.sender) + 1  from CONVO_START AS C where C.sender = U.username)) as popScore \
			From MAIN AS U;".replace(new RegExp('@searcher_username', "g"), searcher_username).replace('searched_username', searched_username), )

	// console.log("KERIIIIIIII: ", transform_csv_lists_to_arrays(user_query[0]))
	return transform_csv_lists_to_arrays(user_query[0])
};

exports.get_my_user = async (searched_username) => {
	console.log("Getting my profile: ", searched_username)
	let keri_string = 
		"WITH TAGLIST as (                                           \
			SELECT                                                   \
				username,                                            \
				firstName,                                           \
				lastName,                                            \
				bio,                                                 \
				DOB,                             \
				mail,                                                \
				password,                                            \
				mailVerified,                                        \
				gender,                                              \
				sekesualOri,                                         \
				zipCode,                                             \
				city,                                                \
				isCompleteProfile,                                   \
				longitude,                                           \
				latitude,                                            \
				id,                                                  \
				image0,                                              \
				image1,                                              \
				image2,                                              \
				image3,                                              \
				profilePic,                                          \
				last_connected, \
				TIMESTAMPDIFF(SECOND , last_connected, NOW()) <= 3 as connected,\
				GROUP_CONCAT(tag) as tag_list                        \
			FROM USERS                                               \
			LEFT JOIN TAGS T                                         \
				on USERS.username = T.user                           \
				WHERE username='searched_username'                   \
			GROUP BY username),                                      \
																	 \
			LIKELIST AS (                                            \
				SELECT                                               \
					username,                                        \
					firstName,                                       \
					lastName,                                        \
					bio,                                             \
					DOB,                             \
					mail,                                            \
					password,                                        \
					mailVerified,                                    \
					gender,                                          \
					sekesualOri,                                     \
					zipCode,                                         \
					city,                                            \
					isCompleteProfile,                               \
					longitude,                                       \
					latitude,                                        \
					id,                                              \
					image0,                                          \
					image1,                                          \
					image2,                                          \
					image3,                                          \
					profilePic,                                      \
					last_connected, \
					TIMESTAMPDIFF(SECOND , last_connected, NOW()) <= 3 as connected,\
					GROUP_CONCAT(liker) as like_list,                \
					tag_list                                         \
			FROM TAGLIST                                             \
			LEFT JOIN LIKES L                                        \
				on TAGLIST.username = L.liked                        \
			GROUP BY username,                                       \
			password, tag_list),                                      \
\
			MATCHES AS (                                                                      \
				SELECT l1.liker, l1.liked                                                     \
					FROM LIKES l1 INNER JOIN LIKES l2                                         \
						ON l1.liked = l2.liker                                                \
						AND l1.liker = l2.liked                                               \
						AND l1.liker != l1.liked),                                            \
																								\
			CONVO_START AS (                                                                  \
				SELECT                                                                        \
					m1.sender, m1.receiver                                                    \
				FROM                                                                          \
					MSG AS m1                                                                 \
				WHERE                                                                         \
					m1.last_updated =                                                         \
						(SELECT                                                               \
								MIN(m2.last_updated)                                             \
							FROM                                                                 \
								MSG m2                                                           \
							WHERE m1.ConvoId = m2.ConvoId))                                      \
																	 \
			SELECT                                                   \
				username,                                            \
				firstName,                                           \
				lastName,                                            \
				IF(                                                  \
					(username IN(SELECT liked                        \
									FROM LIKES                       \
									WHERE liker='searcher_username'  \
									)                                \
					), 1 , 0)                                        \
					as did_i_like_him,                               \
				bio,                                                 \
				DOB,                             \
				TIMESTAMPDIFF(YEAR, DOB, CURDATE()) as age, \
				mail,                                                \
				password,                                            \
				mailVerified,                                        \
				gender,                                              \
				sekesualOri,                                         \
				zipCode,                                             \
				city,                                                \
				isCompleteProfile,                                   \
				longitude,                                           \
				latitude,                                            \
				id,                                                  \
				image0,                                              \
				image1,                                              \
				image2,                                              \
				image3,                                              \
				profilePic,                                          \
				like_list,                                           \
				tag_list,                                            \
				last_connected, \
				TIMESTAMPDIFF(SECOND , last_connected, NOW()) <= 3 as connected,\
				((Select COUNT(*) from MATCHES AS M where M.liker = username) / (Select COUNT(B.liker) from LIKES AS B where B.liker = username)) + ((Select COUNT(*) from CONVO_START AS C where C.receiver = username) / (Select COUNT(C.sender) + 1  from CONVO_START AS C where C.sender = username)) as popScore, \
				GROUP_CONCAT(consulter) as consult_list              \
			FROM LIKELIST                                            \
			LEFT JOIN CONSULTS                                       \
				on LIKELIST.username = CONSULTS.consulted            \
			GROUP BY username,                                       \
			password, tag_list, like_list;".replace('searcher_username', searched_username).replace('searched_username', searched_username)
	
	// console.log("get my user str: ", keri_string.replace(new RegExp(" {2,100}", "g"), "\n"))
	let user_query = await db.query(keri_string)
	// console.log("KERIIIIIIII: ", transform_csv_lists_to_arrays(user_query[0]))
	return transform_csv_lists_to_arrays(user_query[0])
};

exports.search_users = async (searcher_username, min_age, max_age, required_tags, min_rating, zipcode, offset, limit, orderby, asc_or_desc, desires) => {
	console.log("Searching users ")
	console.log("criteria: ",
	"min_age :", min_age,
	"max_age :", max_age,
	"interest_tags :", required_tags,
	"min_rating :", min_rating,
	"zipcodes :", zipcode,
	"offset: ", offset,
	"limit: ", limit, 
	"order_by: ", orderby, 
	"desires: ", desires, 
	"asc_or_desc: ", asc_or_desc)

	let tag_list = ""
	if (required_tags == undefined || required_tags.length == 0) {
		tag_list = 'T.tag'
	}
	else {
		first = true
		for (const tag of required_tags) {
			if (first) {
				tag_list += `'${tag}'`
				first = false
			}
			else {
				tag_list += `, '${tag}'`
			}
		}
	}

	if (zipcode == undefined || zipcode == null) {
		zipcode = "USERS.zipCode"
	}
	else {
		zipcode = `'${zipcode}'`
	}

	let orderby_str
	if (orderby != null && orderby != undefined) {
		orderby_str = `ORDER BY ${orderby} ${asc_or_desc}`
	}
	else {
		orderby_str = ""
	}

	let desire_str = ""
	first = true
	for (const d of desires) {
		desire_str += first ? "AND (" : " OR "
		desire_str += `(gender = '${d.gender}' AND sekesualOri = '${d.sekesualOri}')`
		first = false
	}
	if (desire_str != "") {
		desire_str += ')'
	}
	console.log("taglist: ", tag_list)
	console.log("desire_ste: ", desire_str)
	console.log("zipcode: ", zipcode)
	console.log("orderby_str: ", orderby_str)
	
	let keri_string =  
		"WITH                                                                               \
		\
		MATCHES AS (                                                                        \
			SELECT l1.liker, l1.liked                                                       \
				FROM LIKES l1 INNER JOIN LIKES l2                                           \
					ON l1.liked = l2.liker                                                  \
					AND l1.liker = l2.liked                                                 \
					AND l1.liker != l1.liked                                                \
		),                                                                                  \
																							\
		CONVO_START AS (                                                                    \
			SELECT                                                                          \
				m1.sender, m1.receiver                                                      \
			FROM                                                                            \
				MSG AS m1                                                                   \
			WHERE                                                                           \
				m1.last_updated =                                                           \
					(SELECT                                                                 \
						MIN(m2.last_updated)                                            \
					FROM                                                                \
						MSG m2                                                          \
					WHERE m1.ConvoId = m2.ConvoId)\
		),                                     \
		                                                                                    \
		USERLIST as (                                                                       \
			SELECT                                                                          \
				user                                                                        \
			FROM USERS                                                                      \
			INNER JOIN TAGS T                                                               \
				on USERS.username = T.user                                                  \
				AND T.tag in (TAG_LIST)                                                     \
				AND TIMESTAMPDIFF(YEAR, DOB, CURDATE()) >= MIN_AGE                          \
				AND TIMESTAMPDIFF(YEAR, DOB, CURDATE()) <= MAX_AGE                          \
				AND ((Select COUNT(*) from MATCHES AS M where M.liker = username) / (Select COUNT(B.liker) from LIKES AS B where B.liker = username)) + ((Select COUNT(*) from CONVO_START AS C where C.receiver = username) / (Select COUNT(C.sender) + 1  from CONVO_START AS C where C.sender = username)) >= MIN_POP_SCORE                                               \
				AND zipCode in (ZIPCODE)                                                    \
				@desires                                           \
				AND IF((username IN(SELECT blocked                                          \
					FROM BLOCKS                                                             \
					WHERE blocker='searcher_username')                                      \
					), 1 , 0) = 0                                                           \
			GROUP BY user                                                                   \
			),                                                                              \
																                            \
		TAGLIST as (                                                                        \
			SELECT                                                                          \
				USERLIST.user,                                                              \
				GROUP_CONCAT(tag) as tag_list                                               \
			FROM USERLIST                                                                   \
			LEFT JOIN TAGS                                                                  \
				ON USERLIST.user = TAGS.user                                                \
			GROUP BY user                                                                   \
		)                                                                                  \
																                            \
		SELECT                                                                              \
			username,                                                                       \
			firstName,                                                                      \
			lastName,                                                                       \
			bio,                                                                            \
			gender,                                                                         \
			TIMESTAMPDIFF(YEAR, DOB, CURDATE()) as age,                                     \
			DOB,                                                                            \
			sekesualOri,                                                                    \
			zipCode,                                                                        \
			city,                                                                           \
			isCompleteProfile,                                                              \
			0 as did_i_block_him,\
			image0,                                                                         \
			image1,                                                                         \
			image2,                                                                         \
			image3,                                                                         \
			longitude,                                                                      \
			latitude,                                                                       \
			mailVerified,                                                                   \
			tag_list,                                                                       \
			((Select COUNT(*) from MATCHES AS M where M.liker = username) / (Select COUNT(B.liker) from LIKES AS B where B.liker = username)) + ((Select COUNT(*) from CONVO_START AS C where C.receiver = username) / (Select COUNT(C.sender) + 1  from CONVO_START AS C where C.sender = username)) as popScore,\
			IF((username IN(SELECT liked                                                    \
							FROM LIKES                                                      \
							WHERE liker='searcher_username')                                \
							), 1 , 0)                                                       \
							AS did_i_like_him                                               \
																                            \
			FROM USERS INNER JOIN TAGLIST                                                   \
				ON USERS.username = TAGLIST.user                                            \
			ORDERBYREPLACE                                                                  \
			LIMIT LIMIT_REPLACE OFFSET OFFSET_REPLACE;"
			.replace("TAG_LIST"         , tag_list         )
			.replace("MIN_AGE"          , min_age          )
			.replace("MAX_AGE"          , max_age          )
			.replace("MIN_POP_SCORE"    , min_rating       )
			.replace("ZIPCODE"          , zipcode          )
			.replace(new RegExp("searcher_username", "g"), searcher_username)
			.replace(new RegExp("@desires", "g"), desire_str)
			.replace('ORDERBYREPLACE'   , orderby_str)
			.replace('OFFSET_REPLACE'   , offset)
			.replace('LIMIT_REPLACE'    , limit)

	// console.log("search str: ", keri_string.replace(new RegExp(" {2,100}", "g"), "\n"))

	// console.log("quyeriro: ", keri_string)
	let user_query = await db.query(keri_string)

	// console.log("KERIIIIIIII: ", user_query.map(user => transform_csv_lists_to_arrays(user)))
	return transform_csv_lists_to_arrays(user_query.map(user => transform_csv_lists_to_arrays(user)))
};
