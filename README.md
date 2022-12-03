# NEVM-crud-tutorial
A basic NEVM crud

## Prerequisites

- node 16.13.2
- mysql 8

```
export MATCHA_DB='sekesidb'
export MATCHA_TEST_DB='sekesitest'
export TEST='false'

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