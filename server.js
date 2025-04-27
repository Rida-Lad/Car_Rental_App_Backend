const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'car_rental',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// JWT secret
const JWT_SECRET = 'your_jwt_secret';

// Signup endpoint
app.post('/api/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Check if user exists
    const [users] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (users.length > 0) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    await pool.query(
      'INSERT INTO users (username, password, isadmin) VALUES (?, ?, ?)',
      [username, hashedPassword, false]
    );
    
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Find user
      const [users] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
      if (users.length === 0) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      const user = users[0];
      
      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Create token
      const token = jwt.sign(
        { id: user.id, username: user.username, isAdmin: user.isadmin },
        JWT_SECRET,
        { expiresIn: '1h' }
      );
      
      res.json({ 
        token,
        username: user.username,
        isAdmin: user.isadmin
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});