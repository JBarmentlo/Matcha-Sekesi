create table if not exists USERS
(
    username          varchar(100)             not null,
    firstName         varchar(100)             null,
    lastName          varchar(100)             null,
    bio               varchar(100)             null,
    mail              varchar(100)             not null,
    password          varchar(100)             not null,
    mailVerified      tinyint(1)  default 0    not null,
    gender            varchar(10)              null,
    sekesualOri       varchar(10) default 'bi' null,
    popScore          float       default 0    not null,
    zipCode           varchar(10)              null,
    city              varchar(100)             null,
    isCompleteProfile tinyint(1)  default 0    not null,
    longitude         float                    null,
    latitude          float                    null,
    id                mediumint auto_increment
        primary key,
    constraint USERS_mail_uindex
        unique (mail),
    constraint USERS_username_uindex
        unique (username)
);

create table if not exists BLOCKS
(
    blocker varchar(100) not null,
    blocked varchar(100) not null,
    constraint blocked_fk
        foreign key (blocked) references USERS (username),
    constraint blocker_fk
        foreign key (blocker) references USERS (username)
);

create table if not exists CONSULTS
(
    consulter varchar(100) not null,
    consulted varchar(100) not null,
    constraint consulted_fk
        foreign key (consulted) references USERS (username),
    constraint consulter_fk
        foreign key (consulter) references USERS (username)
);

create table if not exists LIKES
(
    liker varchar(100) not null,
    liked varchar(100) not null,
    constraint liked_username_fk
        foreign key (liked) references USERS (username),
    constraint liker_username_fk
        foreign key (liker) references USERS (username)
);

create table if not exists PICTURES
(
    url  varchar(100) null,
    user varchar(100) null,
    constraint PICTURES_USERS_username_fk
        foreign key (user) references USERS (username)
);

create table if not exists TAGS
(
    tag  varchar(100) not null,
    user varchar(100) not null,
    constraint user___fk
        foreign key (user) references USERS (username)
);

create table if not exists VERIFY
(
    user    varchar(100) null,
    id_hash varchar(100) null,
    constraint user_verify___fk
        foreign key (user) references USERS (username)
);

