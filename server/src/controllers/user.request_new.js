const db       = require("../db/sql.conn");

exports.get_my_user = async (username) => {
	let keri_string = 
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
	
	LIKER_LIST as (
		SELECT
			liked,
			JSON_ARRAYAGG(liker) as liker_list
		FROM
			LIKES
		GROUP BY
			liked
	),
	
	CONSULTER_LIST as (
		SELECT
			consulted,
			JSON_ARRAYAGG(consulter) as consulter_list
		FROM
			CONSULTS
		GROUP BY
			consulted
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
	
	CONVO_START AS (
		SELECT
			m1.sender as convo_starter,
			m1.receiver as convo_reciever
		FROM
			MSG AS m1
		WHERE
			m1.last_updated =
				(SELECT
					MIN(m2.last_updated)
				FROM
					MSG m2
				WHERE
					m1.ConvoId = m2.ConvoId)
	),
	
	CONVO_START_INFO AS (
		SELECT USERS.username,
			   SUM(convo_starter=USERS.username) as converstations_initiated,
			   SUM(convo_reciever=USERS.username) as converstations_recieved
		FROM USERS
			CROSS JOIN CONVO_START
		GROUP BY
			USERS.username
	),
	
	LIKES_INFO as (
		SELECT USERS.username,
			   SUM(liker=?) > 0 as did_i_like_him,
			   SUM(liker=USERS.username) as number_of_likes_given,
			   SUM(liked=USERS.username) as number_of_likes_received
		FROM USERS
			CROSS JOIN LIKES
		GROUP BY USERS.username
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
	),
	
	POPSCORE as (
		SELECT USERS.username,
			   IFNULL((number_of_likes_received / (number_of_likes_received + number_of_likes_given + 1)) * 2.5
				   + (converstations_initiated / (converstations_recieved + converstations_initiated + 1)) * 2.5, 0) as pop_score
		FROM USERS
			LEFT JOIN LIKES_INFO
				ON USERS.username=LIKES_INFO.username
			LEFT JOIN CONVO_START_INFO
				ON USERS.username = CONVO_START_INFO.username
	)
	
	
	
	SELECT
		USERS.username,
		password,
		firstName,
		lastName,
		IFNULL(bio, '') as bio,
		DOB,
		mail,
		is_verified_mail,
		gender,
		sekesualOri,
		zipCode,
		city,
		is_complete_profile,
		longitude,
		latitude,
		id,
		image0,
		image1,
		image2,
		image3,
		profilePic,
		gif,
		last_connected,
		pop_score,
		TIMESTAMPDIFF(SECOND , last_connected, NOW()) <= 3 as connected,
		IFNULL(TIMESTAMPDIFF(YEAR, DOB, CURDATE()), 1) as age,
		IFNULL(tag_list, cast('[]' as json)) as tag_list,
		IFNULL(liker_list, cast('[]' as json)) as liker_list,
		IFNULL(consulter_list, cast('[]' as json)) as consulter_list
	FROM
		USERS
	LEFT JOIN VALIDMAIL
		ON USERS.username = VALIDMAIL.username
	LEFT JOIN COMPLETEPROFILE
		ON USERS.username = COMPLETEPROFILE.username
	LEFT JOIN POPSCORE
		ON USERS.username = POPSCORE.username
	LEFT JOIN TAG_LIST
		ON USERS.username = TAG_LIST.user
	LEFT JOIN LIKER_LIST
		ON USERS.username = LIKER_LIST.liked
	LEFT JOIN CONSULTER_LIST
		ON USERS.username = CONSULTER_LIST.consulted
	
	WHERE
		USERS.username='jhonny'
	
	GROUP BY USERS.username, firstName, lastName, bio, DOB, mail, is_verified_mail, gender, sekesualOri, zipCode, city, is_complete_profile, longitude, latitude, id, image0, image1, image2, image3, profilePic, gif, last_connected
	`

	let my_user = await db.query(keri_string, [username])
	// console.log("found", my_user)
	return my_user
}