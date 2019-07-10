const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB();

// Test endpoint
app.get('/', (req, res) => {
  res.send('Hello World!!!')
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
});