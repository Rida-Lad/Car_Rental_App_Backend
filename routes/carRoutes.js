const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { 
  addCar, 
  getCars 
} = require('../controllers/carController');

// POST: Add a new car (with image upload)
router.post('/', upload.single('image'), addCar);

// GET: Fetch all cars
router.get('/', getCars);

module.exports = router;