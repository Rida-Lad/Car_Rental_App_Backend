const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',       
  password: '',  
  database: 'car_rental'
});

module.exports = pool;