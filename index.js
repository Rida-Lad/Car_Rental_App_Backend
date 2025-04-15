// Import Express
const express = require('express');

// Create an Express application
const app = express();
const port = 5000;

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});