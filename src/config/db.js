import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', // your mysql user
  password: '', // your mysql password
  database: 'car_rental',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;