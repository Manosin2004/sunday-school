const mysql = require('mysql2/promise');
const pool = mysql.createPool({
  host: 'sunday-school-db-backlinksdentalium-1991.h.aivencloud.com',
  port: 16046,
  user: 'avnadmin',
  password: 'AVNS_P_PoBlOOauniC47fm3V',
  database: 'defaultdb',
  ssl: { rejectUnauthorized: false },
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;