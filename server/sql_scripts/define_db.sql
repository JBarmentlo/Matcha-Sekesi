create table USERS
(
    username          varchar(100)                              not null,
    firstName         varchar(100)                              null,
    lastName          varchar(100)                              null,
    bio               varchar(300)                              null,
    mail              varchar(100)                              not null,
    password          varchar(100)                              not null,
    mailVerified      tinyint(1)  default 0                     not null,
    gender            varchar(10)                               null,
    sekesualOri       varchar(10) default 'bi'                  null,
    popScore          float       default 0                     not null,
    zipCode           varchar(10)                               null,
    city              varchar(100)                              null,
    isCompleteProfile tinyint(1)  default 0                     not null,
    longitude         float                                     null,
    latitude          float                                     null,
    id                mediumint auto_increment
        primary key,
    image1            varchar(100)                              null,
    image2            varchar(100)                              null,
    image3            varchar(100)                              null,
    image0            varchar(100)                              null,
    profilePic        varchar(100)                              null,
    DOB               date                                      null,
    last_connected    timestamp   default '2022-09-28 11:54:54' null,
    constraint USERS_mail_uindex
        unique (mail),
    constraint USERS_username_uindex
        unique (username)
);

create table BLOCKS
(
    blocker      varchar(100)                        not null,
    blocked      varchar(100)                        not null,
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

create table CONSULTS
(
    consulter    varchar(100)                        not null,
    consulted    varchar(100)                        not null,
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

create table LIKES
(
    liker        varchar(100)                        not null,
    liked        varchar(100)                        not null,
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

create table MSG
(
    id           int auto_increment
        primary key,
    sender       varchar(100)                        not null,
    receiver     varchar(100)                        not null,
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

create table NOTIFS
(
    id           int auto_increment
        primary key,
    type         varchar(10)                          not null,
    source_user  varchar(100)                         not null,
    target_user  varchar(100)                         not null,
    seen         tinyint(1) default 0                 null,
    last_updated timestamp  default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    constraint source_user_notif_fk
        foreign key (source_user) references USERS (username)
            on delete cascade,
    constraint target_user_notif_fk
        foreign key (target_user) references USERS (username)
            on delete cascade
);

create table REPORTS
(
    reporter     varchar(100)                        not null,
    reported     varchar(100)                        not null,
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

create table RESET
(
    user         varchar(100)                        null,
    id_hash      varchar(100)                        null,
    last_updated timestamp default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    constraint user_reset___fk
        foreign key (user) references USERS (username)
            on delete cascade
);

create table TAGS
(
    tag          varchar(100)                        not null,
    user         varchar(100)                        not null,
    last_updated timestamp default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    constraint no_duplicate_tags
        unique (user, tag),
    constraint user___fk
        foreign key (user) references USERS (username)
            on delete cascade
);

create table VERIFY
(
    user         varchar(100)                        null,
    id_hash      varchar(100)                        null,
    last_updated timestamp default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    constraint user_verify___fk
        foreign key (user) references USERS (username)
            on delete cascade
);
