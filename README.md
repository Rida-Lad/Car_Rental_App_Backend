# Car Rental Backend API

This is a backend REST API built with Node.js, Express, and MySQL for a car rental platform. It supports user authentication, car management, order placement, and admin functionality for managing orders and car availability.

## 🚀 Features

- 🔐 User Signup & Login (with session support)
- 🧾 JWT-less session-based authentication
- 🚗 Car listing with image upload (via multer)
- 📦 Place car rental orders
- 📋 View user-specific and all admin orders
- 🛠 Admin route to approve/decline orders
- ✅ Toggle car availability

## 🧰 Tech Stack

- Node.js
- Express.js
- MySQL2
- bcrypt
- multer
- express-session
- cors

## 📁 Project Structure
├── uploads/ # Uploaded car images
├── server.js # Main server file (provided)
├── package.json
└── README.md


## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/car-rental-backend.git
cd car-rental-backend

```
### 2. Install dependencies
with npm install
### 3. Configure the MySQL Database
Create a MySQL database named car_rental and the following tables:
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE cars (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  image_url TEXT,
  isavailable BOOLEAN,
  previous_price DECIMAL(10, 2),
  new_price DECIMAL(10, 2),
  brand VARCHAR(255),
  category VARCHAR(255)
);

CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  car_id INT,
  hours INT,
  total_price DECIMAL(10, 2),
  status ENUM('pending', 'approved', 'declined') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  access_code VARCHAR(255)
);
### 3. Start the server
node index.js
Server will run on http://localhost:5000

## 🔌 API Endpoints Overview
Auth Routes
POST /api/signup

POST /api/login

GET /api/me

Car Routes
POST /api/cars – Add car (with image upload)

GET /api/cars – Fetch all cars

Order Routes
POST /orders – Place order

GET /api/orders/user/:id – Get user orders

Admin Routes
POST /api/admin/verify – Verify access code

GET /api/admin/orders – Get all orders

POST /api/admin/orders/:id/status – Approve/decline order

GET /api/admin/cars – Get all cars

POST /api/admin/cars/:id/availability – Update availability
