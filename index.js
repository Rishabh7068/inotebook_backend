const connectToMongo = require('./db');
const express = require('express');
const cors = require('cors');
require('dotenv').config();


connectToMongo();
const app = express()
const port = process.env.port;
app.use(express.json());

app.use(cors());
// All Routes

app.use('/api/auth' , require('./routes/auth'))
app.use('/api/notes' , require('./routes/notes'))


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/love', (req, res) => {
  res.send('lovee');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


