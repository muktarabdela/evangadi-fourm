const mysql2 = require('mysql2');

require('dotenv').config();
const { DATABASE_USER, DATABASE_NAME, DATABASE_HOST, DATABASE_PASSWORD, DATABASE_CONNECTION_LIMIT } = process.env;
const dbConnection = mysql2.createPool({
    user: DATABASE_USER,
    database: DATABASE_NAME,
    host: DATABASE_HOST,
    password: DATABASE_PASSWORD,
    connectionLimit: DATABASE_CONNECTION_LIMIT
})
module.exports = dbConnection.promise();

