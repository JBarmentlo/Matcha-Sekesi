# Matcha Sekesi - A TinderLike

A basic tinderlike web app built on a Vue2 / express / mysql stack.

## Install The dependencies

- node 16.13.2
- mysql 8


#### **`client/.env`**

```bash
VUE_APP_MATCHA_HTTPS_PORT=9443
VUE_APP_MATCHA_HTTP_PORT =9080
VUE_APP_MATCHA_DEFAULT_PORT=9080
VUE_APP_MATCHA_SERVER_HOST='http://localhost:9080'
```

<br><br/>
## Export environment variables

```bash
sudo su
export PATH=$PATH:/home/ubuntu/.nvm/versions/node/v16.13.2/bin/
```

<br><br/>
## Build the client

```bash
cd client
npm i
npm run build
```


<br><br/>
## Create / Reset DataBase

Create the production and test databases (sekesidb and sekesitest)
Define the schema for the databases.
Create the Mysql user Sammy.

```bash
cd server
node node commune_data_loader.js
```

```bash
cd sql_scripts
sudo bash here_create_user_table.sh
```

To monitor the db using DataGrips (or similar tool) connect to `ubuntu@matcha.yoopster.com:22`.  
The Mysql service listens to `port 3306` the user is sammy and the password is `XXXXXX`.


<br><br/>
## Decrypt the secrets

You will need Oauth secrets for 42 and mailgun dependenc secrets in the following format:

#### **`server/.env`**

```bash
APIkey="XXXXXXXXXXXX"
APIurl="XXXXXXXXXXXX"
OAUTH_ID="XXXXXXXXXXXX"
OAUTH_SECRET="XXXXXXXXXXXX"
```

For convenience an encrypted version of those is on the repo, decrypt it with:

```bash
gpg -d .env.gpg
```


<br><br/>
## Start the server

Go to the server folder and run:

```bash
# Install dependencies if first time setup
npm i

# For development
nodemon server.js

# For production
pm2 start server.js
```


<br><br/>
## Kill the server

As root, with the path exports from above:  
If you used PM2 to start it.

```bash
pm2 stop server
```

Or find running server PID and kill by hand:

```bash
sudo netstat -lntp | grep -w ':80'
kill pid
```

<br><br/>
## Monitor the logs

```bash
pm2 logs server
```

Or examine the log files at `server/logs/*.logs`

<br><br/>
## Get access to git

Create a deploy key for your project and put it on your server

```bash
eval `ssh-agent`
ssh-add deploy_sekes
```


<br><br/>
## Run test suite

```bash
cd SQL_Server
npm run test
```

<br><br/>
## Setup for yourself

This project runs on a `t2.medium` AWS ec2 instance.  
It uses the mailgun service.
It uses the 42 Oauth2 service.

If you are setting this up on your own server you will need

1. A DNS.
2. A let's encrypt SSL certificate.
3. Register your application for 42 Oauth [here](https://profile.intra.42.fr/oauth/applications/new).
4. Create a mailgun account [here](https://www.mailgun.com/).
5. **Change the password for mysql**.



```sql
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
    SELECT JSON_ARRAYAGG(tag) as searcher_tag_list
    FROM TAGS
    WHERE user=@searcher
    GROUP BY user
),

COMPATIBLE as (
    SELECT USERS.username,
       ((searcher.gender = USERS.gender)
            AND (searcher.sekesualOri IN ('Gay', 'Bi'))
            AND (USERS.sekesualOri IN ('Gay', 'Bi')))
            OR
        ((searcher.gender != USERS.gender)
             AND (searcher.sekesualOri IN ('Hetero', 'Bi'))
             AND (USERS.sekesualOri IN ('Hetero', 'Bi')))
        as compatible
    FROM USERS
        LEFT JOIN USERS searcher ON searcher.username = @searcher
),


BLOCKED as (
    SELECT blocked, SUM(blocker=@searcher) > 0 as did_i_block_him
    FROM BLOCKS
    GROUP BY blocked
),

LIKED as (
    SELECT liked, SUM(liker=@searcher) > 0 as did_i_like_him, COUNT(liker) as number_of_likes_received
    FROM LIKES
    GROUP BY liked
),

VALIDMAIL as (
    SELECT username, COUNT(VERIFIEDMAIL.mail) as verified_mail
    FROM USERS LEFT JOIN VERIFIEDMAIL
        ON USERS.username = VERIFIEDMAIL.user
    GROUP BY USERS.username
),

DISTANCE as (
    select USERS.username, SQRT(POWER(USERS.longitude - searcher.longitude, 2) + POWER(USERS.latitude - searcher.latitude, 2)) as distance
        from USERS CROSS JOIN USERS searcher
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
        m1.sender as convo_starter, m1.receiver as convo_reciever
    FROM
        MSG AS m1
    WHERE
        m1.last_updated =
            (SELECT
                MIN(m2.last_updated)
            FROM
                MSG m2
            WHERE m1.ConvoId = m2.ConvoId)
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
        LEFT JOIN LIKES_INFO ON USERS.username=LIKES_INFO.username
        LEFT JOIN CONVO_START_INFO ON USERS.username = CONVO_START_INFO.username
),

TAG_INFO as (
    SELECT user,
           JSON_ARRAYAGG(tag) as tag_list,
           SUM(IF(FIND_IN_SET(tag, (SELECT GROUP_CONCAT(tag) as searcher_tags_cat
                                    FROM TAGS
                                    WHERE user=@searcher
                                    GROUP BY user)), 1, 0)) as common_tags,
          SUM(IF(FIND_IN_SET(tag, 'Music,Travel'), 1, 0)) as n_required_tags
    FROM TAGS
    GROUP BY user
),

SIMILARITY as (
    SELECT
        USERS.username, (POPSCORE.popScore * 40 + common_tags * 30 - distance + 60) as similarityScore
    FROM
        USERS
    LEFT JOIN DISTANCE ON
        USERS.username = DISTANCE.username
    LEFT JOIN POPSCORE ON
        USERS.username = POPSCORE.username
    LEFT JOIN TAG_INFO ON
        USERS.username = TAG_INFO.user
)
SELECT * from SIMILARITY;
```
