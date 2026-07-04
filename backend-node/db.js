const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'sql306.infinityfree.com',
  user: process.env.DB_USER || 'if0_42337212',
  password: process.env.DB_PASS || 'Sundayschool950',
  database: process.env.DB_NAME || 'if0_42337212_sundayschool',
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;
