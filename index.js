const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'your_mysql_password',
  database: 'auth_db'
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL connected');
});

// Create users table if not exists
db.query(`CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE,
  password VARCHAR(255)
)`);

const SECRET_KEY = 'your_secret_key';

// Signup endpoint
app.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    db.query('INSERT INTO users (username, password) VALUES (?, ?)', 
      [username, hashedPassword], 
      (error) => {
        if (error) return res.status(400).json({ message: 'User already exists' });
        res.status(201).json({ message: 'User created' });
      });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user' });
  }
});

// Signin endpoint
app.post('/signin', (req, res) => {
  const { username, password } = req.body;
  
  db.query('SELECT * FROM users WHERE username = ?', [username], async (error, results) => {
    if (error || results.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const user = results[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ message: 'Invalid credentials' });
    
    const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  });
});

app.listen(5000, () => console.log('Server running on port 5000'));