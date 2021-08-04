# Migrations

This project uses Knex.js for databse setup and queries. Migration files will set up the tables required for the project. Keep in mind that you must **create the database** on your local system or server first.

Migration and seed files must end in .cjs because currently KnexJS does not support ESM directly. We must run it as a common module.

## How to run migrations

To run all migration files in the `/database/migrations` folder, `cd` to the root of your project. Then:

`npx knex migrate:latest --knexfile knexfile.cjs`  
If you installed Knex globally (npm install knex -g)  
`knex migrate:latest --knexfile knexfile.cjs`  

To run a specific migration file in the `/database/migrations` folder:

`npx knex migrate:up name_of_file.cjs --knexfile knexfile.cjs`
If you installed Knex globally (npm install knex -g)  
`knex migrate:up name_of_file.cjs --knexfile knexfile.cjs`

## More Info

[Knexjs.org - Migrations](https://knexjs.org/#Migrations)









