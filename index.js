const connectToMongo = require('./db');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

connectToMongo();
const app = express()
const port = process.env.port;
app.use(express.json());

app.use(cors());

// All Routes

app.use('/api/auth' , require('./routes/auth'))
app.use('/api/Employee' , require('./routes/Employee'))

app.get('/uploads/:filename', (req, res) => {
  const { filename } = req.params; // Get the filename from the URL
  const filePath = path.join(__dirname, 'uploads', filename);
  console.log(filePath);
  // Send the file as a response
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error(err);
      res.status(404).send('Image not found');
    }
  });
});


app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})


