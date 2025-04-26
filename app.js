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