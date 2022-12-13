const Pool = require("pg").Pool

const {DB_PASSWORD, DB_USER, DB_HOST, DB_PORT, DB_NAME} = process.env

//connect to the database
const pool = new Pool({
    user:DB_USER,
    password:DB_PASSWORD,
    host:DB_HOST,
    port:DB_PORT,
    database: DB_NAME
})

module.exports = pool
