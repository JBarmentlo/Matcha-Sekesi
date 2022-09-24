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
                "SELECT                                          \
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
                    IF(                                     \
                        (username IN(SELECT liked           \
                                     FROM LIKES             \
                                     where liker = ?        \
                                     )                      \
                        ), 1 , 0)                           \
                        as did_i_like_him,                  \
                    GROUP_CONCAT(tag) as tag_list               \
                FROM USERS                                      \
                LEFT JOIN TAGS T                                \
                    on USERS.username = T.user                  \
                GROUP BY username;"
        , searcher_username)
        return query.map(user => transform_csv_lists_to_arrays(user))
    
};

exports.get_user = async (searcher_username, searched_username) => {
    console.log(searcher_username, " is looking for: ", searched_username)
    let user_query = await db.query(
            "SELECT                                                  \
                username,                                            \
                firstName,                                           \
                lastName,                                            \
                bio,                                                 \
                gender,                                              \
                sekesualOri,                                         \
                popScore,                                            \
                zipCode,                                             \
                city,                                                \
                isCompleteProfile,                                   \
                image0,                                              \
                image1,                                              \
                image2,                                              \
                image3,                                              \
                longitude,                                           \
                latitude,                                            \
                mailVerified, \
                GROUP_CONCAT(tag) as tag_list,                       \
                IF((username IN(SELECT liked                         \
                                FROM LIKES                           \
                                WHERE liker='searcher_username')     \
                                ), 1 , 0)                            \
                                AS did_i_like_him                    \
            FROM USERS                                               \
            LEFT JOIN TAGS T                                         \
                on USERS.username = T.user                           \
                WHERE username='searched_username'                   \
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