# Database

We are using Knex.js query builder to manage our databases. 

## Local database setup

In order to run migration and seed files, you will need to **set up a  database** on your local system or your deployment server that is supported by Knex.JS:
Postgres, MSSQL, MySQL, MariaDB, Oracle, or Amazon Redshift.

## Install a database server on your local machine

Example for postgres on MacOS using brew:  
`brew install postgres`  
`brew services start postgresql`  
`create user myUser with encrypted password 'myPassword';`

## Create a database and grant user privileges

Example with postgres:  
`psql -U myUser`  
`create database myDatabase;`  
`grant all privileges on database myDatabase to myUser;`  
Exit psql  
`\q`

Once you have set up your database, you will need to update the database connection information in the `.env` file at the root of the project.

Here are the keys that need to be updated. This example is for a Postgres database. In your `.env` file:

```
...
DB_PORT=5432
DB_NAME=myDatabase
DB_HOST=localhost
DB_USER=myUser
DB_PASSWORD=myPassword
DB_CLIENT='pg'
DB_CHARSET='utf8'
...
```
Replace `myDatabse`, `myUser` and `myPassword` with the values for your database.

## knex.cjs

This file creates the connection to our database, which is defined in the `.env` file.

Currently Knex will not run in ES module mode so we are using the .cjs extension to run it in CommonJS mode in this app.

## More Info:

[Knex.js - Query Builder](https://knexjs.org/)