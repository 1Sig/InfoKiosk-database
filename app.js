// server.js
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3050;

// Connect to MongoDB
mongoose.connect('mongodb+srv://sigurdowre:Flodi123@infokiosk.apraybf.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true });

// Create a Mongoose model for files
const File = mongoose.model('File', {
  fileName: String,
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// API endpoint to upload a file
app.post('/upload', async (req, res) => {
  const { fileName } = req.body;

  // Insert file information into MongoDB
  try {
    const file = new File({ fileName });
    const savedFile = await file.save();
    res.json(savedFile);
  } catch (error) {
    console.error('Error inserting file into the database:', error);
    res.status(500).json({ error: 'Error inserting file into the database.' });
  }
});

// API endpoint to get a list of files
app.get('/files', async (req, res) => {
  try {
    const files = await File.find({}, 'fileName');
    res.json(files);
  } catch (error) {
    console.error('Error fetching files from the database:', error);
    res.status(500).json({ error: 'Error fetching files from the database.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
