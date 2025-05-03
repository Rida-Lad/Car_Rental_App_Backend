const express = require('express');
const cors = require('cors');
const multer = require('multer');
const session = require('express-session');
const bcrypt = require('bcrypt');
const path = require('path');
const mysql = require('mysql2');


const app = express();
app.use(cors());
app.use(express.json());
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false,
}));
app.use('/uploads', express.static('uploads'));

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


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});
const upload = multer({ storage: storage });



// Signup route
app.post('/api/signup', async (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err, result) => {
    if (err) return res.status(500).json({ error: 'Signup failed' });

    req.session.user = { id: result.insertId, username };
    res.json({ user: req.session.user, is_authenticated: true });
  });
});

// Login route
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err || results.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    req.session.user = { id: user.id, username: user.username };
    res.json({ user: req.session.user, is_authenticated: true });
  });
});


// Get current user route
app.get('/api/me', (req, res) => {
  if (req.session.user) {
    res.json({ user: req.session.user, is_authenticated: true });
  } else {
    res.json({ is_authenticated: false });
  }
});


// POST route
app.post('/api/cars', upload.single('image'), (req, res) => {
  const { name, isavailable, previous_price, new_price, brand, category } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  const query = `
    INSERT INTO cars (name, image_url, isavailable, previous_price, new_price, brand, category)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    name,
    image_url,
    isavailable === 'true' ? 1 : 0,
    previous_price || null,
    new_price,
    brand,
    category
  ];

  pool.execute(query, values, (err, result) => {
    if (err) {
      console.error('Insert error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ message: 'Car added successfully' });
  });
});


// GET route to fetch all cars
app.get('/api/cars', (req, res) => {
  pool.query('SELECT * FROM cars', (err, results) => {
    if (err) {
      console.error('Fetch error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});