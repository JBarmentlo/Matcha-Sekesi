# NEVM-crud-tutorial
A basic NEVM crud

- node 16.13.2
- mysql 8

## Start the server

```bash
sudo su
export MATCHA_DB='sekesidb'
export MATCHA_TEST_DB='sekesitest'
export TEST='false'
export ENVIRONMENT='TEST'
export PATH=$PATH:/home/ubuntu/.nvm/versions/node/v16.13.2/bin/
```

Reset the db if you want:
```bash
cd server/sql_scripts
sudo bash here_create_user_table.sh
```

Go to the server folder and run:
```bash
nodemon server.js
```

### Get access to git

```bash
eval `ssh-agent`
ssh-add deploy_sekes
```

### Mysql Setup

Create the databases (sekesidb and sekesitest)
Define the tables for the databases.
Create the Mysql user Sammy.

```bash
cd server/sql_scripts
sudo bash here_create_user_table.sh
```

### NPM setup

```bash
cd client
npm i
```

## Run the project

### build the front

```bash
npm run build
```

### Start the backend server


```bash
cd SQL_Server
node server.js
```



## Tests

```bash
cd SQL_Server
npm run test
```

# Nginx

Listening to the 80 port might be troublesome in some scenarios (like an EC2 instance)
You may want to set up an NGINX with this config.   
[NGINX](https://www.nginx.com/blog/setting-up-nginx/)   
[Conf](https://stackoverflow.com/questions/24861311/forwarding-port-80-to-8080-using-nginx)

```nginx
server {
    listen 80;
    server_name matcha.yoopster.com;

    location / {
        proxy_set_header   X-Forwarded-For $remote_addr;
        proxy_set_header   Host $http_host;
        proxy_pass         "http://127.0.0.1:8081";
    }
}
```