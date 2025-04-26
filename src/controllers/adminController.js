import pool from '../config/db.js';

// Car Management
export const createCar = async (req, res) => {
  const { model, description, price_per_day, image_url } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO cars (model, description, price_per_day, image_url) VALUES (?, ?, ?, ?)',
      [model, description, price_per_day, image_url]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Error creating car' });
  }
};

export const getAllCars = async (req, res) => {
  try {
    const [cars] = await pool.query('SELECT * FROM cars');
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cars' });
  }
};

export const updateCarAvailability = async (req, res) => {
  try {
    const [car] = await pool.query('UPDATE cars SET available = NOT available WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Error updating availability' });
  }
};

// Order Management
export const getAllOrders = async (req, res) => {
  try {
    const [orders] = await pool.query(`
      SELECT orders.*, users.email, cars.model 
      FROM orders 
      JOIN users ON orders.user_id = users.id
      JOIN cars ON orders.car_id = cars.id
    `);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  try {
    await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Error updating status' });
  }
};