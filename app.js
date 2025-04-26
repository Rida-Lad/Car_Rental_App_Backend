const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());        
app.use(express.json()); 

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});