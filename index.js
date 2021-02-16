require('dotenv').config()
const express = require('express');
const routes = require('./routes');
require('./models')

const app = express();
const port = 9200;

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '50mb' }));

app.use('/', routes)

app.listen(process.env.PORT || port, () => {
  console.log(`Server is running at port ${port}`);
});
