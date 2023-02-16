const db       = require("../db/sql.conn");

exports.get_my_user = async (username) => {
	console.log("Getting my user profile: %s", username)
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
	TIMESTAMPDIFF(SECOND, last_connected, NOW()) <= 3 as connected,
	IFNULL(TIMESTAMPDIFF(YEAR, DOB, CURDATE()), 1) as age,
	IFNULL(tag_list,       cast('[]' as json)) as tag_list,
	IFNULL(liker_list,     cast('[]' as json)) as like_list,
	IFNULL(consulter_list, cast('[]' as json)) as consult_list
FROM
	USERS
LEFT JOIN VALIDMAIL
	ON USERS.username = VALIDMAIL.username
LEFT JOIN COMPLETEPROFILE
	ON USERS.username = COMPLETEPROFILE.username
LEFT JOIN TAG_LIST
	ON USERS.username = TAG_LIST.user
LEFT JOIN LIKER_LIST
	ON USERS.username = LIKER_LIST.liked
LEFT JOIN CONSULTER_LIST
	ON USERS.username = CONSULTER_LIST.consulted

WHERE
	USERS.username=?
GROUP BY USERS.username, firstName, lastName, bio, DOB, mail, is_verified_mail, gender, sekesualOri, zipCode, city, is_complete_profile, longitude, latitude, id, image0, image1, image2, image3, profilePic, gif, last_connected
`
	let my_user = await db.query(keri_string, [username, username])
	// console.log("found", my_user[0])
	if (my_user.length == 0) {
		return null
	}
	return my_user[0]
}

exports.get_user = async (searcher_username, searched_username) => {
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
           SUM(liker='${searcher_username}') > 0 as did_i_like_him,
           SUM(liker=USERS.username) as number_of_likes_given,
           SUM(liked=USERS.username) as number_of_likes_received
    FROM USERS
        LEFT JOIN LIKES on USERS.username = LIKES.liker OR USERS.username = LIKES.liked
    GROUP BY USERS.username
),

POPSCORE as (
    SELECT USERS.username,
           IFNULL((number_of_likes_received / (number_of_likes_received + number_of_likes_given + 1)), 0) * 2.5
               + IFNULL((converstations_initiated / (converstations_recieved + converstations_initiated + 1)), 0) * 2.5 as pop_score
    FROM USERS
        LEFT JOIN LIKES_INFO
            ON USERS.username=LIKES_INFO.username
        LEFT JOIN CONVO_START_INFO
            ON USERS.username = CONVO_START_INFO.username
),

BLOCKED as (
    SELECT
        blocked,
        SUM(blocker='${searcher_username}') > 0 as did_i_block_him
    FROM
        BLOCKS
    GROUP BY
        blocked
),

LIKED as (
    SELECT liked,
           SUM(liker='${searcher_username}') > 0 as did_i_like_him,
           COUNT(liker) as number_of_likes_received
    FROM LIKES
    GROUP BY liked
)

SELECT
    USERS.username,
    firstName,
    lastName,
    IFNULL(bio, '') as bio,
    DOB,
    USERS.mail,
    gender,
    sekesualOri,
    zipCode,
    city,
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
    is_verified_mail,
    IFNULL(did_i_like_him, 0) as did_i_like_him,
    IFNULL(TIMESTAMPDIFF(YEAR, DOB, CURDATE()), 1) as age,
    IFNULL(tag_list, cast('[]' as json)) as tag_list,
    IFNULL(did_i_block_him, 0) as did_i_block_him
FROM
    USERS
LEFT JOIN POPSCORE
    ON USERS.username = POPSCORE.username
LEFT JOIN LIKED
    ON USERS.username = LIKED.liked
LEFT JOIN BLOCKED
    ON USERS.username = BLOCKED.blocked
LEFT JOIN TAG_LIST
    ON USERS.username = TAG_LIST.user
LEFT JOIN VALIDMAIL
	ON USERS.username = VALIDMAIL.username
WHERE
    USERS.username='${searched_username}'
GROUP BY USERS.username, firstName, lastName, bio, DOB, USERS.mail, gender, sekesualOri, zipCode, city, longitude, latitude, id, image0, image1, image2, image3, profilePic, gif, last_connected
LIMIT 10 OFFSET 0
`
	let other_user = await db.query(keri_string)
	if (other_user.length == 0) {
		return null
	}
	return other_user[0]
}

exports.search_users_initial = async (searcher_username,
									  offset,
									  limit) => {

    console.log("INITIAL search:\n", {
		searcher_username : searcher_username,
		offset            : offset,
		limit             : limit
	})

	let required_tags = ''
	let keri_string = 
`
WITH
TAG_INFO as (
    SELECT
        user,
        JSON_ARRAYAGG(tag) as tag_list,
        SUM(IF(FIND_IN_SET(tag, (SELECT GROUP_CONCAT(tag) as searcher_tags_cat
                                 FROM TAGS
                                 WHERE user='${searcher_username}'
                                 GROUP BY user)), 1, 0)) as number_of_common_tags,
        SUM(IF(FIND_IN_SET(tag, '${required_tags}'), 1, 0)) as number_of_required_tags,
        COUNT(tag) as number_of_tags
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
           SUM(liker='${searcher_username}') > 0 as did_i_like_him,
           SUM(liker=USERS.username) as number_of_likes_given,
           SUM(liked=USERS.username) as number_of_likes_received
    FROM USERS
        LEFT JOIN LIKES on USERS.username = LIKES.liker OR USERS.username = LIKES.liked
    GROUP BY USERS.username
),


POPSCORE as (
    SELECT USERS.username,
           IFNULL((number_of_likes_received / (number_of_likes_received + number_of_likes_given + 1)), 0) * 2.5
               + IFNULL((converstations_initiated / (converstations_recieved + converstations_initiated + 1)), 0) * 2.5 as pop_score
    FROM USERS
        LEFT JOIN LIKES_INFO
            ON USERS.username=LIKES_INFO.username
        LEFT JOIN CONVO_START_INFO
            ON USERS.username = CONVO_START_INFO.username
),

COMPATIBLE as (
    SELECT
        USERS.username,
        (
            (searcher.gender = USERS.gender)
                AND
            (searcher.sekesualOri IN ('Gay', 'Bi'))
                AND
            (USERS.sekesualOri IN ('Gay', 'Bi'))
        )
            OR
        (
            (searcher.gender != USERS.gender)
                AND
            (searcher.sekesualOri IN ('Hetero', 'Bi'))
                AND
            (USERS.sekesualOri IN ('Hetero', 'Bi')))
        as compatible
    FROM USERS
        LEFT JOIN USERS searcher ON searcher.username = '${searcher_username}'
),

BLOCKED as (
    SELECT
        blocked,
        SUM(blocker='${searcher_username}') > 0 as did_i_block_him
    FROM
        BLOCKS
    GROUP BY
        blocked
),

LIKED as (
    SELECT liked,
           SUM(liker='${searcher_username}') > 0 as did_i_like_him,
           COUNT(liker) as number_of_likes_received
    FROM LIKES
    GROUP BY liked
),

DISTANCE as (
    select USERS.username,
           SQRT(POWER(USERS.longitude - searcher.longitude, 2) + POWER(USERS.latitude - searcher.latitude, 2)) as distance
        from USERS
            CROSS JOIN USERS searcher
                ON searcher.username='${searcher_username}'
),

SIMILARITY as (
    SELECT
        USERS.username,
        (POPSCORE.pop_score * 40 + number_of_common_tags * 30 - distance + 60) as similarity_score
    FROM
        USERS
    LEFT JOIN DISTANCE ON
        USERS.username = DISTANCE.username
    LEFT JOIN POPSCORE ON
        USERS.username = POPSCORE.username
    LEFT JOIN TAG_INFO ON
        USERS.username = TAG_INFO.user
)

SELECT
    USERS.username,
    firstName,
    lastName,
    IFNULL(bio, '') as bio,
    DOB,
    mail,
    gender,
    sekesualOri,
    zipCode,
    city,
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
    IFNULL(did_i_like_him, 0) as did_i_like_him,
    IFNULL(TIMESTAMPDIFF(YEAR, DOB, CURDATE()), 1) as age,
    IFNULL(tag_list, cast('[]' as json)) as tag_list,
    number_of_common_tags,
    number_of_required_tags,
    similarity_score,
	IFNULL(did_i_block_him, 0) as did_i_block_him
FROM
    USERS
LEFT JOIN POPSCORE
    ON USERS.username = POPSCORE.username
LEFT JOIN LIKED
    ON USERS.username = LIKED.liked
LEFT JOIN BLOCKED
    ON USERS.username = BLOCKED.blocked
LEFT JOIN COMPATIBLE
    ON USERS.username = COMPATIBLE.username
LEFT JOIN TAG_INFO
    ON USERS.username = TAG_INFO.user
LEFT JOIN SIMILARITY
    ON USERS.username = SIMILARITY.username
WHERE
    COMPATIBLE.compatible AND
    USERS.username!='${searcher_username}'
GROUP BY USERS.username, firstName, lastName, bio, DOB, mail, gender, sekesualOri, zipCode, city, longitude, latitude, id, image0, image1, image2, image3, profilePic, gif, last_connected
HAVING
    did_i_block_him=0
ORDER BY similarity_score DESC
LIMIT ${limit} OFFSET ${offset}
`
	let search_results = await db.query(keri_string)
	return search_results
}

exports.search_users = async (searcher_username, 
							  min_age,
							  max_age,
							  required_tags,
							  min_rating,
							  max_rating,
							  zipcode,
							  offset,
							  limit,
							  orderby,
							  asc_or_desc) => {


	zipcode = zipcode ? `%${zipcode}%` : '%'
	required_tags ? required_tags : []
	let number_of_required_tags = required_tags.length
	required_tags = required_tags.join(',')

	let keri_string = 
`
WITH
TAG_INFO as (
    SELECT
        user,
        JSON_ARRAYAGG(tag) as tag_list,
        SUM(IF(FIND_IN_SET(tag, (SELECT GROUP_CONCAT(tag) as searcher_tags_cat
                                 FROM TAGS
                                 WHERE user='${searcher_username}'
                                 GROUP BY user)), 1, 0)) as number_of_common_tags,
        SUM(IF(FIND_IN_SET(tag, '${required_tags}'), 1, 0)) as number_of_required_tags,
        COUNT(tag) as number_of_tags
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
           SUM(liker='${searcher_username}') > 0 as did_i_like_him,
           SUM(liker=USERS.username) as number_of_likes_given,
           SUM(liked=USERS.username) as number_of_likes_received
    FROM USERS
        LEFT JOIN LIKES on USERS.username = LIKES.liker OR USERS.username = LIKES.liked
    GROUP BY USERS.username
),


POPSCORE as (
    SELECT USERS.username,
           IFNULL((number_of_likes_received / (number_of_likes_received + number_of_likes_given + 1)), 0) * 2.5
               + IFNULL((converstations_initiated / (converstations_recieved + converstations_initiated + 1)), 0) * 2.5 as pop_score
    FROM USERS
        LEFT JOIN LIKES_INFO
            ON USERS.username=LIKES_INFO.username
        LEFT JOIN CONVO_START_INFO
            ON USERS.username = CONVO_START_INFO.username
),
BLOCKED as (
    SELECT
        blocked,
        SUM(blocker='${searcher_username}') > 0 as did_i_block_him
    FROM
        BLOCKS
    GROUP BY
        blocked
),

LIKED as (
    SELECT liked,
           SUM(liker='${searcher_username}') > 0 as did_i_like_him,
           COUNT(liker) as number_of_likes_received
    FROM LIKES
    GROUP BY liked
),

DISTANCE as (
    select USERS.username,
           SQRT(POWER(USERS.longitude - searcher.longitude, 2) + POWER(USERS.latitude - searcher.latitude, 2)) as distance
        from USERS
            CROSS JOIN USERS searcher
                ON searcher.username='${searcher_username}'
)


SELECT
    USERS.username,
    firstName,
    lastName,
    IFNULL(bio, '') as bio,
    DOB,
    mail,
    gender,
    sekesualOri,
    zipCode,
    city,
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
    pop_score as popScore,
    distance,
    IFNULL(did_i_like_him, 0) as did_i_like_him,
    IFNULL(TIMESTAMPDIFF(YEAR, DOB, CURDATE()), 18) as age,
    IFNULL(tag_list, cast('[]' as json)) as tag_list,
    IFNULL(did_i_block_him, 0) as did_i_block_him,
    IFNULL(number_of_common_tags, 0) as number_of_common_tags,
    IFNULL(number_of_required_tags, 0) as number_of_required_tags
FROM
    USERS
LEFT JOIN POPSCORE
    ON USERS.username = POPSCORE.username
LEFT JOIN LIKED
    ON USERS.username = LIKED.liked
LEFT JOIN BLOCKED
    ON USERS.username = BLOCKED.blocked
LEFT JOIN TAG_INFO
    ON USERS.username = TAG_INFO.user
LEFT JOIN DISTANCE
    ON USERS.username = DISTANCE.username
WHERE
    zipCode LIKE('${zipcode}') AND
    pop_score >= ${min_rating} AND
    pop_score <= ${max_rating} AND
    USERS.username!='${searcher_username}'

GROUP BY USERS.username, firstName, lastName, bio, DOB, mail, gender, sekesualOri, zipCode, city, longitude, latitude, id, image0, image1, image2, image3, profilePic, gif, last_connected
HAVING
    age <= ${max_age} AND
    age >= ${min_age} AND
    did_i_block_him = 0 AND
    number_of_required_tags = ${number_of_required_tags}
ORDER BY ${orderby} ${asc_or_desc}
LIMIT ${limit} OFFSET ${offset}
`
	let search_results = await db.query(keri_string)
	return search_results
}
