const express = require('express');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8000;

app.use(express.static('dist'));

app.get('/', (req, res) => {
  res.status(200).sendFile('./index.html');
});

app.use((req, res) => {
  res.status(404).send('sorry, resource not found');
});

app.listen(port, () => console.log(`app listening on port ${port}`));

module.exports = app;
