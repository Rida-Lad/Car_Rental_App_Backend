const pool = require('../config/db');

// Add a new car
exports.addCar = async (req, res) => {
  try {
    const { name, description, price_per_day, is_available, category } = req.body;
    const image = req.file ? req.file.filename : null;

    const [result] = await pool.query(
      `INSERT INTO cars 
       (name, image, description, price_per_day, is_available, category) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, image, description, price_per_day, is_available, category]
    );

    res.status(201).json({ message: 'Car added!', carId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all cars
exports.getCars = async (req, res) => {
  try {
    const [cars] = await pool.query('SELECT * FROM cars');
    const carsWithImageUrl = cars.map(car => ({
      ...car,
      image: car.image ? `http://localhost:3000/uploads/${car.image}` : null
    }));
    res.json(carsWithImageUrl);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};