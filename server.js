const express = require('express');
const connectDB = require('./config/db');

const app = express();

connectDB();

const PORT = process.env.PORT || 6000;

app.get('/', (req, res) => {
  res.send('Server up and running');
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
