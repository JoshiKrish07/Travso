
const mysql = require("mysql2/promise");
require('dotenv').config();

const db = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  database: process.env.DB_NAME
});

module.exports = db;
