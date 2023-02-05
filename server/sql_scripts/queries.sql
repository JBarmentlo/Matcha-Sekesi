select username, NOT ISNULL(VERIFIEDMAIL.mail) as mail_verified
FROM USERS
LEFT JOIN VERIFIEDMAIL
    ON VERIFIEDMAIL.user = USERS.username
WHERE username='jhonny';

SET @searcher = 'jhonny',

    @searcher_tags = (
    SELECT JSON_ARRAYAGG(tag) as searcher_tag_list
    FROM TAGS
    WHERE user=@searcher
    GROUP BY user),

    @searcher_tags_cat = (
    SELECT GROUP_CONCAT(tag) as searcher_tags_cat
    FROM TAGS
    WHERE user=@searcher
    GROUP BY user),

    @required_tags = 'Music, Travel'
;

WITH ME_TAG_LIST AS (
    SELECT
        JSON_ARRAYAGG(tag) as searcher_tag_list
    FROM
        TAGS
    WHERE
        user=@searcher
    GROUP BY
        user
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
        LEFT JOIN USERS searcher ON searcher.username = @searcher
),


BLOCKED as (
    SELECT
        blocked,
        SUM(blocker=@searcher) > 0 as did_i_block_him
    FROM
        BLOCKS
    GROUP BY
        blocked
),

LIKED as (
    SELECT liked,
           SUM(liker=@searcher) > 0 as did_i_like_him,
           COUNT(liker) as number_of_likes_received
    FROM LIKES
    GROUP BY liked
),

VALIDMAIL as (
    SELECT
        username,
        COUNT(VERIFIEDMAIL.mail) as verified_mail
    FROM
        USERS
            LEFT JOIN VERIFIEDMAIL
                ON USERS.username = VERIFIEDMAIL.user
    GROUP BY USERS.username
),

DISTANCE as (
    select USERS.username,
           SQRT(POWER(USERS.longitude - searcher.longitude, 2) + POWER(USERS.latitude - searcher.latitude, 2)) as distance
        from USERS
            CROSS JOIN USERS searcher
                ON searcher.username=@searcher
),

MATCHES AS (
    SELECT l1.liker as matcher, l1.liked as matchee
        FROM LIKES l1 INNER JOIN LIKES l2
            ON l1.liked = l2.liker
            AND l1.liker = l2.liked
            AND l1.liker != l1.liked
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
           SUM(liker=@searcher) > 0 as did_i_like_him,
           SUM(liker=USERS.username) as number_of_likes_given,
           SUM(liked=USERS.username) as number_of_likes_received
    FROM USERS
        CROSS JOIN LIKES
    GROUP BY USERS.username
),

POPSCORE as (
    SELECT USERS.username,
           (number_of_likes_received / (number_of_likes_received + number_of_likes_given + 1)) * 2.5
               + (converstations_initiated / (converstations_recieved + converstations_initiated + 1)) * 2.5 as popScore
    FROM USERS
        LEFT JOIN LIKES_INFO
            ON USERS.username=LIKES_INFO.username
        LEFT JOIN CONVO_START_INFO
            ON USERS.username = CONVO_START_INFO.username
),

TAG_INFO as (
    SELECT
        user,
        JSON_ARRAYAGG(tag) as tag_list,
        SUM(IF(FIND_IN_SET(tag, (SELECT GROUP_CONCAT(tag) as searcher_tags_cat
                                 FROM TAGS
                                 WHERE user=@searcher
                                 GROUP BY user)), 1, 0)) as common_tags,
        SUM(IF(FIND_IN_SET(tag, 'Music,Travel'), 1, 0)) as n_required_tags
    FROM
        TAGS
    GROUP BY
        user
),

SIMILARITY as (
    SELECT
        USERS.username,
        (POPSCORE.popScore * 40 + common_tags * 30 - distance + 60) as similarityScore
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
    username,
    firstName,
    lastName,
    bio,
    gender,
    TIMESTAMPDIFF(YEAR, DOB, CURDATE()) as age,
    DOB,
    sekesualOri,
    zipCode,
    city,
    isCompleteProfile,
    0 as did_i_block_him,
    image0,
    image1,
    image2,
    image3,
    profilePic,
    longitude,
    latitude


# SELECT * from USERS

# SELECT * from BLOCKED







INSERT INTO LIKES (liker, liked) VALUES ('jhonny', 'bella'), ('bella', 'jhonny')
INSERT INTO LIKES (liker, liked) VALUES ('jhonny', 'jojojo'), ('jojojo', 'jhonny')
INSERT INTO LIKES (liker, liked) VALUES ('bella', 'jojojo'), ('jojojo', 'bella')

DELETE FROM LIKES WHERE liker='jhonny' OR liked='jhonny'