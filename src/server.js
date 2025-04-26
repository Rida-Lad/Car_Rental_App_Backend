import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import carRoutes from './routes/carRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import pool from './config/db.js';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Configure environment variables
dotenv.config();

// ES module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:5173', // Update with your frontend URL
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/public', express.static(path.join(__dirname, 'public')));

// Database connection test
const testDbConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to MySQL database');
    connection.release();
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};
testDbConnection();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});