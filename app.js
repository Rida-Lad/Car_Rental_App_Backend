const express = require('express');
const multer = require('multer');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'car_rental'
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL connected');
});

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes

// Get single car details
app.get('/api/cars/:id', (req, res) => {
  const query = 'SELECT * FROM cars WHERE id = ?';
  db.execute(query, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (results.length === 0) return res.status(404).json({ error: 'Car not found' });
    res.json(results[0]);
  });
});

// Auth middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Create order
app.post('/api/orders', authenticate, (req, res) => {
  const { car_id, days, total_price } = req.body;
  const query = `
    INSERT INTO orders 
    (user_id, car_id, days, total_price)
    VALUES (?, ?, ?, ?)
  `;
  
  db.execute(query, [req.user.id, car_id, days, total_price], (err) => {
    if (err) return res.status(500).json({ error: 'Order failed' });
    res.json({ message: 'Order created successfully' });
  });
});

// Auth routes
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.post('/api/auth/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
  db.execute(query, [username, hashedPassword], (err) => {
    if (err) return res.status(400).json({ error: 'Registration failed' });
    res.status(201).json({ message: 'User registered' });
  });
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM users WHERE username = ?';
  
  db.execute(query, [username], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (results.length === 0 || !(await bcrypt.compare(password, results[0].password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = results[0];
    const token = jwt.sign(
      { id: user.id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.json({ token });
  });
});


// Get all cars (simplified data)
app.get('/api/cars', (req, res) => {
  const query = `
    SELECT id, name, price_per_day, image, category 
    FROM cars
  `;
  
  db.execute(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

app.post('/api/cars', upload.single('image'), (req, res) => {
  const { name, description, price_per_day, is_available, category } = req.body;
  const image = req.file ? req.file.path : null;

  const query = `
    INSERT INTO cars 
    (name, description, image, price_per_day, is_available, category)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.execute(query, 
    [name, description, image, price_per_day, is_available, category],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(201).json({ message: 'Car added successfully' });
    });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));