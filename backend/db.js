// db.js
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',           // change if you’ve set a password
  password: 'wmL0/m3wXDc/UcIn',           // or your password
  database: 'smartroads'
});

module.exports = pool.promise();
