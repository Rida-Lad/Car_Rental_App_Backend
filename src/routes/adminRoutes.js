import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import { 
  getAllOrders,
  updateOrderStatus,
  getAllCars,
  updateCarAvailability,
  createCar 
} from '../controllers/adminController.js';

const router = express.Router();

// Car management
router.post('/addcar', protect, admin, createCar);
router.get('/cars', protect, admin, getAllCars);
router.patch('/cars/:id/availability', protect, admin, updateCarAvailability);

// Order management
router.get('/orders', protect, admin, getAllOrders);
router.patch('/orders/:id/status', protect, admin, updateOrderStatus);

export default router;