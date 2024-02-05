// server.js
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const PORT = 3050;

const ejs = require('ejs');
app.set('view engine', 'ejs');

// Connect to MongoDB
const uri = "mongodb+srv://sigurdowre:<password>@infokiosk.w7sqkux.mongodb.net/?retryWrites=true&w=majority";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const fileSchema = new mongoose.Schema({
  filename: String,
  filepath: String,
});

const File = mongoose.model('File', fileSchema);

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/upload', upload.single('file'), async (req, res) => {
  const { filename, path } = req.file;
  const fileData = { filename, filepath: path };

  try {
    const savedFile = await File.create(fileData);
    res.redirect('/files');
  } catch (error) {
    res.status(500).json({ error: 'Error saving file to database' });
  }
});

app.get('/files', async (req, res) => {
  try {
    const files = await File.find();
    res.render('files', { files });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching files from the database' });
  }
});

app.post('/remove', async (req, res) => {
  const { fileId } = req.body;

  try {
    const removedFile = await File.findByIdAndRemove(fileId);
    res.json({ message: 'File removed successfully', file: removedFile });
  } catch (error) {
    res.status(500).json({ error: 'Error removing file from the database' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});