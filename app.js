const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Set the path to your static files (like HTML, CSS, and JS)
// In this case, assuming index.html is in the root directory
app.use(express.static(__dirname));

// Define a route for the root URL
app.get('/', (req, res) => {
  // Send the index.html file
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// Allow nodemon to restart the server on file changes
module.exports = app;