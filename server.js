const express = require('express');

const app = express();

const PORT = process.env.PORT || 6000;

app.get('/', (req, res) => {
  res.send('Server up and running');
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
