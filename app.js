const express = require('express');
const path = require('path');
const { MongoClient, Binary } = require('mongodb');
const { connectToDb, getDb } = require('./db');

const app = express();
const PORT = 3050;

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

// db connection
let db;

connectToDb((err) => {
  if (!err) {
    db = getDb();
  }
});

// route for file upload
app.post('/upload', async (req, res) => {
  try {
    const { file, format } = req.body; // Assuming the file and format are sent in the request body

    // Validate the format against supported formats
    const supportedFormats = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    if (!supportedFormats.includes(format)) {
      return res.status(400).json({ error: 'Unsupported format' });
    }

    // Convert the base64-encoded string to a Buffer
    const binaryData = Buffer.from(file, 'base64');

    // Save file details to MongoDB with Binary data and format
    await db.collection('files').insertOne({
      data: new Binary(binaryData),
      contentType: `image/${format}`,
    });

    res.json({ message: 'File uploaded successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// route for fetching files
app.get('/files', async (req, res) => {
  try {
    const files = await db.collection('files').find().toArray();
    res.status(200).json(files);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


/*
const fileSchema = new mongoose.Schema({
  filename: String,
  data: Buffer, // Use Buffer to store binary data
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

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/upload', upload.single('file'), async (req, res) => {
  const { filename, path } = req.file;
  try {
    // Read the file as binary data
    const data = await fs.promises.readFile(path);
    // Encode the binary data as base64
    const base64Data = data.toString('base64');
    // Save the file data to the database
    const savedFile = await File.create({ filename, data: Buffer.from(base64Data, 'base64') });
    // Respond with a JSON object containing the base64-encoded data
    res.json({ message: 'File uploaded successfully', file: savedFile });
  } catch (error) {
    console.error('Error saving file to database:', error);
    res.status(500).json({ error: 'Error saving file to database' });
  }
});


app.get('/files', async (req, res) => {
  try {
    const files = await File.find();

    // Convert each file's data to base64 for JSON response
    const filesWithBase64Data = files.map(file => ({
      filename: file.filename,
      data: file.data.toString('base64'),
      text: file.text,
    }));

    res.json(filesWithBase64Data);
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
*/
