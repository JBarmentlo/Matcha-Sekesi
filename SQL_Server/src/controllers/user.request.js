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
                "SELECT                              \
                    username,                        \
                    firstName,                       \
                    lastName,                        \
                    bio,                             \
                    mail,                            \
                    password,                        \
                    mailVerified,                    \
                    gender,                          \
                    sekesualOri,                     \
                    popScore,                        \
                    zipCode,                         \
                    city,                            \
                    isCompleteProfile,               \
                    longitude,                       \
                    latitude,                        \
                    id,                              \
                    TIMESTAMPDIFF(YEAR, DOB, CURDATE()) as age,                             \
                    DOB,                             \
                    IF(                              \
                        (username IN(SELECT liked    \
                                     FROM LIKES      \
                                     where liker = ? \
                                     )               \
                        ), 1 , 0)                    \
                        as did_i_like_him,           \
                    GROUP_CONCAT(tag) as tag_list    \
                FROM USERS                           \
                LEFT JOIN TAGS T                     \
                    on USERS.username = T.user       \
                GROUP BY username;"
        , searcher_username)
        return query.map(user => transform_csv_lists_to_arrays(user))
};

exports.get_user = async (searcher_username, searched_username) => {
    // console.log(searcher_username, " is looking for: ", searched_username)
    let user_query = await db.query(
            "SELECT                                              \
                username,                                        \
                firstName,                                       \
                lastName,                                        \
                bio,                                             \
                gender,                                          \
                TIMESTAMPDIFF(YEAR, DOB, CURDATE()) as age,                                             \
                DOB,                             \
                sekesualOri,                                     \
                popScore,                                        \
                zipCode,                                         \
                city,                                            \
                isCompleteProfile,                               \
                image0,                                          \
                image1,                                          \
                image2,                                          \
                image3,                                          \
                longitude,                                       \
                latitude,                                        \
                mailVerified,                                    \
                GROUP_CONCAT(tag) as tag_list,                   \
                IF((username IN(SELECT liked                     \
                                FROM LIKES                       \
                                WHERE liker='searcher_username') \
                                ), 1 , 0)                        \
                                AS did_i_like_him                \
            FROM USERS                                           \
            LEFT JOIN TAGS T                                     \
                on USERS.username = T.user                       \
                WHERE username='searched_username'               \
            GROUP BY username;".replace('searcher_username', searcher_username).replace('searched_username', searched_username)
    , )

    // console.log("KERIIIIIIII: ", transform_csv_lists_to_arrays(user_query[0]))
    return transform_csv_lists_to_arrays(user_query[0])
};

exports.get_my_user = async (searched_username) => {
    console.log("Getting my profile: ", searched_username)
    let user_query = await db.query(
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
                popScore,                                            \
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
                    popScore,                                        \
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
                    GROUP_CONCAT(liker) as like_list,                \
                    tag_list                                         \
            FROM TAGLIST                                             \
            LEFT JOIN LIKES L                                        \
                on TAGLIST.username = L.liked                        \
            GROUP BY username,                                       \
            password, tag_list)                                      \
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
                TIMESTAMPDIFF(YEAR, DOB, CURDATE()) as age,                                             \
                mail,                                                \
                password,                                            \
                mailVerified,                                        \
                gender,                                              \
                sekesualOri,                                         \
                popScore,                                            \
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
                GROUP_CONCAT(consulter) as consult_list              \
            FROM LIKELIST                                            \
            LEFT JOIN CONSULTS                                       \
                on LIKELIST.username = CONSULTS.consulted            \
            GROUP BY username,                                       \
            password, tag_list, like_list;".replace('searcher_username', searched_username).replace('searched_username', searched_username)
    , )

    // console.log("KERIIIIIIII: ", transform_csv_lists_to_arrays(user_query[0]))
    return transform_csv_lists_to_arrays(user_query[0])
};

exports.search_users = async (searcher_username, min_age, max_age, required_tags, min_rating, zipcode) => {
    console.log("Searching users ")
    let tag_list
    if (required_tags == undefined || required_tags.length == 0) {
        tag_list = 'T.tag'
    }
    else {
        first = true
        for (const tag in required_tags) {
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
    console.log("taglist: ", tag_list)
    console.log("zipcode: ", zipcode)
    
    let keri_string =  "WITH USERLIST as (                                     \
            SELECT                                              \
                user                                            \
            FROM USERS                                          \
            INNER JOIN TAGS T                                   \
                on USERS.username = T.user                      \
                AND T.tag in (TAG_LIST)                          \
                AND TIMESTAMPDIFF(YEAR, DOB, CURDATE()) >= MIN_AGE    \
                AND TIMESTAMPDIFF(YEAR, DOB, CURDATE()) <= MAX_AGE \
                AND popScore >= MIN_POP_SCORE                               \
                AND zipCode in (ZIPCODE)                        \
            GROUP BY user                                       \
            LIMIT 10 \
            ),                                                  \
                                                                \
            TAGLIST as (                                        \
                SELECT                                          \
                    USERLIST.user,                              \
                    GROUP_CONCAT(tag) as tag_list               \
                FROM USERLIST                                   \
                LEFT JOIN TAGS                                  \
                    ON USERLIST.user = TAGS.user                \
                GROUP BY user                                   \
            )                                                   \
                                                                \
        SELECT                                                  \
            username,                                           \
            firstName,                                          \
            lastName,                                           \
            bio,                                                \
            gender,                                             \
            TIMESTAMPDIFF(YEAR, DOB, CURDATE()) as age,         \
            DOB,                                                \
            sekesualOri,                                        \
            popScore,                                           \
            zipCode,                                            \
            city,                                               \
            isCompleteProfile,                                  \
            image0,                                             \
            image1,                                             \
            image2,                                             \
            image3,                                             \
            longitude,                                          \
            latitude,                                           \
            mailVerified,                                       \
            tag_list,                                           \
            IF((username IN(SELECT liked                        \
                            FROM LIKES                          \
                            WHERE liker='searcher_username')    \
                            ), 1 , 0)                           \
                            AS did_i_like_him                   \
                                                                \
            FROM USERS INNER JOIN TAGLIST                       \
                ON USERS.username = TAGLIST.user;".replace("TAG_LIST", tag_list).replace("MIN_AGE", min_age).replace("MAX_AGE", max_age).replace("MIN_POP_SCORE", min_rating).replace("ZIPCODE", zipcode).replace("searcher_username", searcher_username)

    
    // console.log("quyeriro: ", keri_string)
    let user_query = await db.query(keri_string)

    // console.log("KERIIIIIIII: ", user_query.map(user => transform_csv_lists_to_arrays(user)))
    return transform_csv_lists_to_arrays(user_query.map(user => transform_csv_lists_to_arrays(user)))
};


