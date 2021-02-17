require('dotenv').config()
const express = require('express');
const formData = require("express-form-data");
const os = require("os");
const routes = require('./routes');
require('./models')

const app = express();

app.use((req, res, next) => {
  const allowedOrigins = ['http://localhost:8080'];
  const { origin } = req.headers;
  if (allowedOrigins.indexOf(origin) > -1) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, DELETE, POST, PUT, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Disposition');
  res.header('Access-Control-Allow-Credentials', true);
  return next();
});

/**
 * Options are the same as multiparty takes.
 * But there is a new option "autoClean" to clean all files in "uploadDir" folder after the response.
 * By default, it is "false".
 */
const options = {
  uploadDir: os.tmpdir(),
  autoClean: true
};

// parse data with connect-multiparty. 
app.use(formData.parse(options));
// delete from the request all empty files (size == 0)
app.use(formData.format());
// union the body and the files
app.use(formData.union());



const port = 9200;

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '50mb' }));

app.use('/', routes)

app.listen(process.env.PORT || port, () => {
  console.log(`Server is running at port ${port}`);
});
