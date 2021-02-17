const path = require('path');
const bunyan = require('bunyan');
const { Storage } = require('@google-cloud/storage');
const config = require('../config');


const sendJSONResponse = (res, message, status, statusCode, data) => {
  res.status(statusCode);
  res.json({
    message,
    status,
    data,
  });
};

const catchErrors = fn => (req, res, next) => fn(req, res, next).catch(next);

const logger = bunyan.createLogger({
  name: 'Trade Depot',
  level: config.logger.level,
});

const rootDir = () => {
  return path.dirname(require.main.filename || process.mainModule.filename);
};


const storage = new Storage({
  keyFilename: `${rootDir()}/config/firebase.json`,
});

const bucket = storage.bucket("misc-project-305017-sx203");

const uploadImageToStorage = async (file) => {
    if (!file) {
      return null
    }
    let newFileName = `${Date.now()}_${file.originalFilename}`;
    await bucket.upload(file.path, {
      destination: newFileName,
      metadata: {
        cacheControl: 'public, max-age=31536000',
      },
    });
    return `https://storage.googleapis.com/${bucket.name}/${newFileName}`;
}

module.exports = {
  sendJSONResponse,
  catchErrors,
  logger,
  rootDir,
  uploadImageToStorage,
};
