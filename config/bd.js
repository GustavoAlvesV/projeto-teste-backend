const config = require('../knexfile.js')[process.env.NODE_ENV || "development"]

const knex = require('knex')(config)

module.exports = knex