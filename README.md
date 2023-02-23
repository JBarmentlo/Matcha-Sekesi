# Full Server Setup

## Install dependencies

```bash
sudo su
sudo apt install -y zsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
sudo apt install mysql-server
curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
sudo apt-get install -y nodejs
npm i -g nodemon
```

## Get repo

SFTP a deploy key and clone the repo

## Secrets

```bash
cd server

gpg -d .env.gpg > .env
# Or for prod
gpg -d .env.prod.gpg > .env


cd ../client

gpg -d .env.gpg > .env
# Or for prod
gpg -d .env.prod.gpg > .env
```

## DB

Start Mysql

```bash
service mysql start 
```

Check status

```bash
service mysql status

##########      RETURNS           ############

● mysql.service - MySQL Community Server
     Loaded: loaded (/lib/systemd/system/mysql.service; enabled; vendor preset: enabled)
     Active: active (running) since Thu 2023-02-23 16:19:52 UTC; 3min 50s ago
   Main PID: 25190 (mysqld)
     Status: "Server is operational"
      Tasks: 38 (limit: 4689)
     Memory: 364.6M
     CGroup: /system.slice/mysql.service
             └─25190 /usr/sbin/mysqld

```

Define schema

```bash
cd sql_scripts
bash here_create_user_table.sh
```

## Install server dependencies and get commune data

```bash
cd server
npm i
export MATCHA_DB='sekesidb'
export MATCHA_TEST_DB='sekesitest'
export TEST='true'
node commune_data_loader.js
```

## Install client dependencies and build

```bash
cd client
npm i
npm run build
```

## Let's encrypt HTTPS

```bash
sudo snap install core; sudo snap refresh core
sudo apt-get remove certbot
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot

sudo certbot certonly --standalone
```

## 42 Intra Oauth

Register / Get a fresh secret for your app [Here](https://profile.intra.42.fr/oauth/applications)
put it in `server/.env` `OAUTH_SECRET`

## Start the server

Go to the server folder and run:

```bash
# Install dependencies if first time setup
npm i

# For development
nodemon server.js

# For production
pm2 start server.js -l full.log -e error.log -o out.log --time
```


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

## Monitor the logs

```bash
pm2 logs server
```

Or examine the log files at `server/logs/*.logs`

## Get access to git

Create a deploy key for your project and put it on your server

```bash
eval `ssh-agent`
ssh-add deploy_sekes
```
