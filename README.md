# 🚗 Car Rental Backend API

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue)
![Node.js](https://img.shields.io/badge/Node.js-v14+-green)
![Express](https://img.shields.io/badge/Express-v4.0+-blue)
![MySQL](https://img.shields.io/badge/MySQL-v8.0+-orange)

</div>

> A robust RESTful API built with Node.js, Express, and MySQL that powers a car rental platform with authentication, car management, order processing, and administrative functions.

## ✨ Features

<table>
  <tr>
    <td>🔐 <b>User Authentication</b></td>
    <td>Secure signup and login with session support</td>
  </tr>
  <tr>
    <td>🧾 <b>Session Management</b></td>
    <td>JWT-less authentication for better security</td>
  </tr>
  <tr>
    <td>🚙 <b>Car Management</b></td>
    <td>List cars with image upload via multer</td>
  </tr>
  <tr>
    <td>📦 <b>Order Processing</b></td>
    <td>Place and manage car rental orders</td>
  </tr>
  <tr>
    <td>📋 <b>Order Tracking</b></td>
    <td>View user-specific and admin orders</td>
  </tr>
  <tr>
    <td>🛠️ <b>Admin Controls</b></td>
    <td>Approve/decline orders and manage car availability</td>
  </tr>
</table>

## 🧰 Tech Stack

<div align="center">

![Node.js](https://img.shields.io/badge/-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/-Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/-MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![bcrypt](https://img.shields.io/badge/-bcrypt-003B57?style=for-the-badge&logo=npm&logoColor=white)
![multer](https://img.shields.io/badge/-multer-FF6550?style=for-the-badge&logo=npm&logoColor=white)
![express-session](https://img.shields.io/badge/-express--session-000000?style=for-the-badge&logo=express&logoColor=white)
![cors](https://img.shields.io/badge/-cors-000000?style=for-the-badge&logo=npm&logoColor=white)

</div>

## 📁 Project Structure

```
├── uploads/           # Uploaded car images
├── server.js          # Main server file
├── package.json       # Project dependencies
└── README.md          # Documentation
```

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Rida-Lad/Car_Rental_App_Backend.git
cd car-rental-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure MySQL Database

Create a MySQL database named `car_rental` and set up the following tables:

<details>
<summary>📊 Database Schema</summary>

```sql
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
```
</details>

### 4. Start the Server

```bash
node server.js
```

Your server will be running at `http://localhost:5000`

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/signup` | Register a new user |
| `POST` | `/api/login` | User login |
| `GET`  | `/api/me` | Get current user details |

### Car Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/cars` | Add a new car (with image upload) |
| `GET`  | `/api/cars` | Fetch all available cars |

### Order Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/orders` | Place a new car rental order |
| `GET`  | `/api/orders/user/:id` | Get orders for a specific user |

### Admin Functions

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/admin/verify` | Verify admin access code |
| `GET`  | `/api/admin/orders` | Get all orders in the system |
| `POST` | `/api/admin/orders/:id/status` | Update order status (approve/decline) |
| `GET`  | `/api/admin/cars` | Get all cars in the system |
| `POST` | `/api/admin/cars/:id/availability` | Toggle car availability |


## 👨‍💻 Contributors

If you'd like to contribute to this project:

1. Fork the repository
2. Create a new feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---
