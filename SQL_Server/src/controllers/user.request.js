const bcrypt   = require("bcryptjs");
const crypto   = require('crypto');
const jwt      = require("jsonwebtoken");

const db       = require("../db/sql.conn");



exports.get_user = async (username) => {
		return await db.query(
			"WITH TAGLIST as (                                  \
				SELECT                                          \
					username,                                   \
					firstName,                                  \
					lastName,                                   \
					bio,                                        \
					mail,                                       \
					password,                                   \
					mailVerified,                               \
					gender,                                     \
					sekesualOri,                                \
					popScore,                                   \
					zipCode,                                    \
					city,                                       \
					isCompleteProfile,                          \
					longitude,                                  \
					latitude,                                   \
					id,                                         \
					GROUP_CONCAT(tag) as tag_list               \
				FROM USERS                                      \
				INNER JOIN TAGS T                               \
					on USERS.username = T.user                  \
				WHERE username=?                                \
				GROUP BY username),                             \
				                                                \
				LIKELIST AS (                                   \
					SELECT                                      \
						username,                               \
						firstName,                              \
						lastName,                               \
						bio,                                    \
						mail,                                   \
						password,                               \
						mailVerified,                           \
						gender,                                 \
						sekesualOri,                            \
						popScore,                               \
						zipCode,                                \
						city,                                   \
						isCompleteProfile,                      \
						longitude,                              \
						latitude,                               \
						id,                                     \
						GROUP_CONCAT(liker) as like_list,       \
						tag_list                                \
				FROM TAGLIST                                    \
				INNER JOIN LIKES L                              \
					on TAGLIST.username = L.liked               \
				GROUP BY username,                              \
				password, tag_list)                             \
				                                                \
				SELECT                                          \
						username,                               \
						firstName,                              \
						lastName,                               \
						bio,                                    \
						mail,                                   \
						password,                               \
						mailVerified,                           \
						gender,                                 \
						sekesualOri,                            \
						popScore,                               \
						zipCode,                                \
						city,                                   \
						isCompleteProfile,                      \
						longitude,                              \
						latitude,                               \
						id,                                     \
						like_list,                              \
						tag_list,                               \
						GROUP_CONCAT(consulter) as consult_list \
				FROM LIKELIST                                   \
				INNER JOIN CONSULTS                             \
					on LIKELIST.username = CONSULTS.consulted   \
				GROUP BY username,                              \
				password, tag_list, like_list;" 
		, username)
};
