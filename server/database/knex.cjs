/** Database Connection */
require('dotenv').config()

const environment = process.env.NODE_ENV
const config = require('../../knexfile.cjs')[environment]
exports.knex = require('knex')(config)
