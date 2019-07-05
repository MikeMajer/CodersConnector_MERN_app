const express = require('express');

const app = express();

// Test endpoint
app.get('/', (req, res) => {
  res.send('Hello World!!!')
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${5000}`)
});