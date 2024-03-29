create table if not exists USERS
(
    username          varchar(300)                              not null,
    firstName         varchar(300)                              null,
    lastName          varchar(300)                              null,
    bio               varchar(300)                              null,
    mail              varchar(300)                              not null,
    password          varchar(300)                              null,
    gender            varchar(40) default 'NonBinary'                             null,
    sekesualOri       varchar(40) default 'Bi'                  null,
    zipCode           varchar(100)                               null,
    city              varchar(300)                              null,
    longitude         float       default 0                     not null,
    latitude          float       default 0                     not null,
    id                mediumint auto_increment    primary key,
    image1            varchar(300)                              null,
    image2            varchar(300)                              null,
    image3            varchar(300)                              null,
    image0            varchar(300)                              null,
    profilePic        varchar(300)                              null,
    gif               varchar(300)                              null,
    DOB               date                                      null,
    last_connected    timestamp   default '2022-09-28 11:54:54' null,
    constraint USERS_mail_uindex
        unique (mail),
    constraint USERS_username_uindex
        unique (username)
);

create table if not exists BLOCKS
(
    blocker      varchar(300)                        not null,
    blocked      varchar(300)                        not null,
    last_updated timestamp default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    constraint no_duplicates_BLOCKS
        unique (blocker, blocked),
    constraint blocked_fk
        foreign key (blocked) references USERS (username)
            on delete cascade,
    constraint blocker_fk
        foreign key (blocker) references USERS (username)
            on delete cascade
);

create table if not exists CONSULTS
(
    consulter    varchar(300)                        not null,
    consulted    varchar(300)                        not null,
    last_updated timestamp default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    constraint no_duplicates_CONSULTS
        unique (consulter, consulted),
    constraint consulted_fk
        foreign key (consulted) references USERS (username)
            on delete cascade,
    constraint consulter_fk
        foreign key (consulter) references USERS (username)
            on delete cascade
);

create table if not exists LIKES
(
    liker        varchar(300)                        not null,
    liked        varchar(300)                        not null,
    last_updated timestamp default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    constraint no_duplicates_LIKES
        unique (liker, liked),
    constraint liked_username_fk
        foreign key (liked) references USERS (username)
            on delete cascade,
    constraint liker_username_fk
        foreign key (liker) references USERS (username)
            on delete cascade
);

create table if not exists MSG
(
    id           int auto_increment
        primary key,
    sender       varchar(300)                        not null,
    receiver     varchar(300)                        not null,
    msg          varchar(1000)                       null,
    last_updated timestamp default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    ConvoId      varchar(250)                        not null,
    constraint MSG_USERS_username_fk
        foreign key (sender) references USERS (username)
            on delete cascade,
    constraint MSG_USERS_username_fk_2
        foreign key (receiver) references USERS (username)
            on delete cascade
);

create table if not exists NOTIFS
(
    id           int auto_increment
        primary key,
    type         varchar(10)                          not null,
    source_user  varchar(300)                         not null,
    target_user  varchar(300)                         not null,
    seen         tinyint(1) default 0                 null,
    last_updated timestamp  default CURRENT_TIMESTAMP null,
    constraint source_user_notif_fk
        foreign key (source_user) references USERS (username)
            on delete cascade,
    constraint target_user_notif_fk
        foreign key (target_user) references USERS (username)
            on delete cascade
);

create table if not exists Oauth42
(
    id_42    int          not null
        primary key,
    username varchar(300) not null,
    constraint Oauth42_id_42_uindex
        unique (id_42),
    constraint Oauth42_username_uindex
        unique (username),
    constraint Oauth42_USERS_username_fk
        foreign key (username) references USERS (username)
            on delete cascade
);

create table if not exists REPORTS
(
    reporter     varchar(300)                        not null,
    reported     varchar(300)                        not null,
    last_updated timestamp default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    constraint no_duplicates_REPORTS
        unique (reporter, reported),
    constraint reported_username_fk
        foreign key (reported) references USERS (username)
            on delete cascade,
    constraint reporter_username_fk
        foreign key (reporter) references USERS (username)
            on delete cascade
);

create table if not exists RESET
(
    user         varchar(300)                        null,
    id_hash      varchar(300)                        null,
    last_updated timestamp default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    constraint user_reset___fk
        foreign key (user) references USERS (username)
            on delete cascade
);

create table if not exists TAGS
(
    tag          varchar(300)                        not null,
    user         varchar(300)                        not null,
    last_updated timestamp default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    constraint no_duplicate_tags
        unique (user, tag),
    constraint user___fk
        foreign key (user) references USERS (username)
            on delete cascade
);

create table if not exists VERIFIEDMAIL
(
    user         varchar(300)                        null,
    mail         varchar(300)                        null,
    constraint user_mail___fk
        foreign key (user) references USERS (username)
            on delete cascade,
    constraint no_duplicates_MAILS
        unique (mail),
    constraint no_duplicates_USERS
        unique (user)
);


create table if not exists VERIFY
(
    user         varchar(300)                        null,
    id_hash      varchar(300)                        null,
    mail         varchar(300)                        null,
    last_updated timestamp default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    constraint user_verify___fk
        foreign key (user) references USERS (username)
            on delete cascade
);


create table if not exists VILLEPOSTAL
(
    nom_commune    varchar(300)                 null,
    code_postal    varchar(20)                  null,
    longitude      float                        null,
    latitude       float                        null
);
