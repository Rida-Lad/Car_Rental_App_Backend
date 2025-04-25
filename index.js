const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'car-rental',
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL connected');
});


const SECRET_KEY = 'your_secret_key';


app.listen(5000, () => console.log('Server running on port 5000'));