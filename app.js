// server.js
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3050;

const ejs = require('ejs');
app.set('view engine', 'ejs');

// Connect to MongoDB
mongoose.connect('mongodb+srv://sigurdowre:<Flodi123>@infokiosk.apraybf.mongodb.net/?retryWrites=true&w=majority');

// Create a Mongoose model for files
const fileSchema = new mongoose.Schema({
  filename: String,
  filepath: String,
  text: String,
});

const File = mongoose.model('File', fileSchema);

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Express to serve static files and handle file uploads
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Define routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/upload', upload.single('file'), async (req, res) => {
  const { filename, path } = req.file;
  const { text } = req.body;
  const fileData = { filename, filepath: path, text };

  try {
    const savedFile = await File.create(fileData);
    res.redirect('/files'); // Redirect to the list of uploaded files
  } catch (error) {
    res.status(500).json({ error: 'Error saving file and text to database' });
  }
});

// Define a route to display the list of uploaded files
app.get('/files', async (req, res) => {
  try {
    const files = await File.find();
    res.render('files', { files });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching files from the database' });
  }
});

// Define a route to handle file removal
app.post('/remove', async (req, res) => {
  const { fileId } = req.body;

  try {
    const removedFile = await File.findByIdAndRemove(fileId);
    res.json({ message: 'File removed successfully', file: removedFile });
  } catch (error) {
    res.status(500).json({ error: 'Error removing file from the database' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
