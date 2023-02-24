Launch project with docker:
1. Make sure that your folder (Matcha seekesi) belongs to root
2. Decrypt the secrets before launching the docker
3. Build and launch the docker (easier with vscode for volume and ports...)
4. Open terminal in vscode in the docker container
5. launch mysql service + create database
6. Activate localisation
7. Npm i client & npm run build
8. Npm i server and npm start


WITH
TAG_INFO as (
    SELECT
        user,
        JSON_ARRAYAGG(tag) as tag_list,
        SUM(IF(FIND_IN_SET(tag, (SELECT GROUP_CONCAT(tag) as searcher_tags_cat
                                 FROM TAGS
                                 WHERE user=?
                                 GROUP BY user)), 1, 0)) as number_of_common_tags,
        SUM(IF(FIND_IN_SET(tag, ?), 1, 0)) as number_of_required_tags,
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
           SUM(liker=?) > 0 as did_i_like_him,
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
        SUM(blocker=?) > 0 as did_i_block_him
    FROM
        BLOCKS
    GROUP BY
        blocked
),

LIKED as (
    SELECT liked,
           SUM(liker=?) > 0 as did_i_like_him,
           COUNT(liker) as number_of_likes_received
    FROM LIKES
    GROUP BY liked
),

DISTANCE as (
    select USERS.username,
           SQRT(POWER(USERS.longitude - searcher.longitude, 2) + POWER(USERS.latitude - searcher.latitude, 2)) as distance
        from USERS
            CROSS JOIN USERS searcher
                ON searcher.username=?
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
        LEFT JOIN USERS searcher ON searcher.username = 'jhonny'
),

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
    pop_score as popScore,
    distance,
    IFNULL(did_i_like_him, 0) as did_i_like_him,
    IFNULL(TIMESTAMPDIFF(YEAR, DOB, CURDATE()), 18) as age,
    IFNULL(tag_list, cast('[]' as json)) as tag_list,
    IFNULL(did_i_block_him, 0) as did_i_block_him,
    IFNULL(number_of_common_tags, 0) as number_of_common_tags,
    IFNULL(number_of_required_tags, 0) as number_of_required_tags,
    compatible
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
INNER JOIN VERIFIEDMAIL
    ON VERIFIEDMAIL.mail = USERS.mail
LEFT JOIN COMPATIBLE
    ON USERS.username = COMPATIBLE.username
INNER JOIN COMPLETEPROFILE
    ON COMPLETEPROFILE.username = USERS.username
WHERE
    zipCode LIKE(?) AND
    pop_score >= ? AND
    pop_score <= ? AND
    USERS.username!=? AND
    compatible=1 AND
    COMPLETEPROFILE.is_complete_profile = 1


GROUP BY USERS.username, firstName, lastName, bio, DOB, mail, gender, sekesualOri, zipCode, city, longitude, latitude, id, image0, image1, image2, image3, profilePic, gif, last_connected
HAVING
    age <= ? AND
    age >= ? AND
    did_i_block_him = 0 AND
    number_of_required_tags = ?
ORDER BY ? ?
LIMIT ? OFFSET ?