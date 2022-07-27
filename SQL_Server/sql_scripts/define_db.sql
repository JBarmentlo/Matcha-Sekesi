-- we don't know how to generate root <with-no-name> (class Root) :(
grant alter, alter routine, application_password_admin, audit_admin, authentication_policy_admin, backup_admin, binlog_admin, binlog_encryption_admin, clone_admin, connection_admin, create, create role, create routine, create tablespace, create temporary tables, create user, create view, delete, drop, drop role, encryption_key_admin, event, execute, file, flush_optimizer_costs, flush_status, flush_tables, flush_user_resources, group_replication_admin, group_replication_stream, index, innodb_redo_log_archive, innodb_redo_log_enable, insert, lock tables, passwordless_user_admin, persist_ro_variables_admin, process, references, reload, replication client, replication slave, replication_applier, replication_slave_admin, resource_group_admin, resource_group_user, role_admin, select, sensitive_variables_observer, service_connection_admin, session_variables_admin, set_user_id, show databases, show view, show_routine, shutdown, super, system_user, system_variables_admin, table_encryption_admin, trigger, update, xa_recover_admin, grant option on *.* to 'debian-sys-maint'@localhost;

grant audit_abort_exempt, select, system_user on *.* to 'mysql.infoschema'@localhost;

grant audit_abort_exempt, backup_admin, clone_admin, connection_admin, persist_ro_variables_admin, session_variables_admin, shutdown, super, system_user, system_variables_admin on *.* to 'mysql.session'@localhost;

grant audit_abort_exempt, system_user on *.* to 'mysql.sys'@localhost;

grant alter, alter routine, application_password_admin, audit_abort_exempt, audit_admin, authentication_policy_admin, backup_admin, binlog_admin, binlog_encryption_admin, clone_admin, connection_admin, create, create role, create routine, create tablespace, create temporary tables, create user, create view, delete, drop, drop role, encryption_key_admin, event, execute, file, flush_optimizer_costs, flush_status, flush_tables, flush_user_resources, group_replication_admin, group_replication_stream, index, innodb_redo_log_archive, innodb_redo_log_enable, insert, lock tables, passwordless_user_admin, persist_ro_variables_admin, process, references, reload, replication client, replication slave, replication_applier, replication_slave_admin, resource_group_admin, resource_group_user, role_admin, select, sensitive_variables_observer, service_connection_admin, session_variables_admin, set_user_id, show databases, show view, show_routine, shutdown, super, system_user, system_variables_admin, table_encryption_admin, trigger, update, xa_recover_admin, grant option on *.* to root@localhost;

grant alter, create, delete, drop, insert, references, reload, select, update, grant option on *.* to sammy@localhost;

create table USERS
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

create table BLOCKS
(
    blocker varchar(100) not null,
    blocked varchar(100) not null,
    constraint blocked_fk
        foreign key (blocked) references USERS (username),
    constraint blocker_fk
        foreign key (blocker) references USERS (username)
);

create table CONSULTS
(
    consulter varchar(100) not null,
    consulted varchar(100) not null,
    constraint consulted_fk
        foreign key (consulted) references USERS (username),
    constraint consulter_fk
        foreign key (consulter) references USERS (username)
);

create table LIKES
(
    liker varchar(100) not null,
    liked varchar(100) not null,
    constraint no_duplicates
        unique (liker, liked),
    constraint liked_username_fk
        foreign key (liked) references USERS (username),
    constraint liker_username_fk
        foreign key (liker) references USERS (username)
);

create table PICTURES
(
    url  varchar(100) null,
    user varchar(100) null,
    constraint PICTURES_USERS_username_fk
        foreign key (user) references USERS (username)
);

create table TAGS
(
    tag  varchar(100) not null,
    user varchar(100) not null,
    constraint user___fk
        foreign key (user) references USERS (username)
);

create table VERIFY
(
    user    varchar(100) null,
    id_hash varchar(100) null,
    constraint user_verify___fk
        foreign key (user) references USERS (username)
);

