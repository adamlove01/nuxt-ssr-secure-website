# Seeds

This project uses Knex.js for databse setup and queries. 

Seed files are used to populate existing tables in your databse with test or seed data. You must run the migrations in the `/migrations` folder first.

Seed files must end in .cjs because currently KnexJS does not support ESM directly. We must run it as a common module.

## How to run seeds

To run all seed files in the `/database/seeds` folder, `cd` to the root of your project. Then:

`npx knex seed:run --knexfile knexfile.cjs`  
If you installed Knex globally (npm install knex -g)  
`knex seed:run --knexfile knexfile.cjs`  

To run a specific migration file in the `/database/seeds` folder:

`npx knex seed:run --specific=name_of_file.cjs --knexfile knexfile.cjs`  
If you installed Knex globally (npm install knex -g)  
`knex seed:run --specific=name_of_file.cjs --knexfile knexfile.cjs`  

## More Info

[Knexjs.org - Seeds](https://knexjs.org/#Seeds)








