# NEVM-crud-tutorial
A basic NEVM crud

## Prerequisites

- node 16.13.2
- mysql 8

### Mysql Setup

Create the databases (sekesidb and sekesitest)
Define the tables for the databases.
Create the Mysql user Sammy.

```bash
cd SQL_Server/sql_scripts
bash here_create_user_table.sh
```

### NPM setup

```bash
cd new_sekes_client
npm i
```

## Run the project

### Start the backend server

You may have to install nodemon `npm install --global nodemon`.

```bash
cd SQL_Server
nodemon server.js
```

### Run the front

```bash
npm run serve
```

## Tests

```bash
cd SQL_Server
npm run test
```