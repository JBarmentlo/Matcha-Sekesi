# Matcha Sekesi - A TinderLike

A basic tinderlike web app built on a Vue2 / express / mysql stack.

## Install The dependencies

- node 16.13.2
- mysql 8


<br><br/>
## Export environment variables

```bash
sudo su
export MATCHA_DB='sekesidb'
export MATCHA_TEST_DB='sekesitest'
export TEST='false'
export ENVIRONMENT='TEST'
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
cd server/sql_scripts
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
