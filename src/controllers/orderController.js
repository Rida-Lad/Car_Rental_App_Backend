import pool from '../config/db.js';

// Create order
export const createOrder = async (req, res) => {
  const { car_id, start_date, end_date } = req.body;
  const user_id = req.user.id;

  try {
    // Calculate total price
    const [car] = await pool.query('SELECT price_per_day FROM cars WHERE id = ?', [car_id]);
    const days = Math.ceil((new Date(end_date) - new Date(start_date)) / (1000 * 60 * 60 * 24));
    const total_price = days * car[0].price_per_day;

    const [result] = await pool.query(
      'INSERT INTO orders (user_id, car_id, start_date, end_date, total_price) VALUES (?, ?, ?, ?, ?)',
      [user_id, car_id, start_date, end_date, total_price]
    );
    
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Error creating order' });
  }
};

// Get user orders
export const getOrders = async (req, res) => {
  try {
    const [orders] = await pool.query(`
      SELECT orders.*, cars.model, cars.image_url 
      FROM orders 
      JOIN cars ON orders.car_id = cars.id 
      WHERE user_id = ?
    `, [req.user.id]);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
};