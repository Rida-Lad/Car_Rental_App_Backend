const express = require('express');
const cors = require('cors');
const multer = require('multer');
const session = require('express-session');
const bcrypt = require('bcrypt');
const path = require('path');
const mysql = require('mysql2');


const app = express();


app.use(express.json());


app.use(express.urlencoded({ extended: true }));


app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true, 
}));


app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, 
    httpOnly: true,
    sameSite: 'lax', 
  },
}));


app.use('/uploads', express.static('uploads'));


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




// Signup route
app.post('/api/signup', async (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err, result) => {
    if (err) return res.status(500).json({ error: 'Signup failed' });

    req.session.user = { id: result.insertId, username };
    res.json({ user: req.session.user, is_authenticated: true });
  });
});



// Login route
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  pool.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
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



app.post('/orders', (req, res) => {
  const { user_id, car_id, hours, total_price } = req.body;

  const sql = 'INSERT INTO orders (user_id, car_id, hours, total_price) VALUES (?, ?, ?, ?)';
  pool.query(sql, [user_id, car_id, hours, total_price], (err, result) => {
    if (err) return res.status(500).json({ message: 'Order failed' });
    res.json({ message: 'Order placed successfully' });
  });
});



app.get('/api/orders/user/:id', (req, res) => {
  const userId = req.params.id;

  const sql = `
    SELECT orders.*, cars.name AS car_name, cars.image_url
    FROM orders
    JOIN cars ON orders.car_id = cars.id
    WHERE orders.user_id = ?
    ORDER BY orders.created_at DESC
  `;

  pool.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Failed to fetch orders' });
    res.json(results);
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


app.post('/api/admin/verify', (req, res) => {
  const { access_code } = req.body;
  pool.query('SELECT * FROM admins WHERE access_code = ?', [access_code], (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    if (results.length > 0) return res.json({ is_admin: true });
    res.status(401).json({ is_admin: false });
  });
});

// Get all orders with user + car info
app.get('/api/admin/orders', (req, res) => {
  const sql = `
    SELECT orders.*, users.username, cars.name AS car_name, cars.image_url
    FROM orders
    JOIN users ON orders.user_id = users.id
    JOIN cars ON orders.car_id = cars.id
    ORDER BY orders.created_at DESC
  `;
  pool.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching orders' });
    res.json(results);
  });
});

// Update order status
app.post('/api/admin/orders/:id/status', (req, res) => {
  const { status } = req.body;
  const orderId = req.params.id;
  if (!['approved', 'declined'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }
  pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, orderId], (err) => {
    if (err) return res.status(500).json({ message: 'Failed to update status' });
    res.json({ message: 'Status updated' });
  });
});


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});