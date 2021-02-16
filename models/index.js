
const mongoose = require('mongoose');
const fs = require('fs');
const config = require('../config');
const { logger } = require('../utils');

/* eslint-ignore */
fs.readdirSync(__dirname)
  .filter(file => file.endsWith('.js') && file !== 'index.js')
  .map(file => require(`${__dirname}/${file}`)); // eslint-disable-line

mongoose.Promise = global.Promise;

const options = {
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 500,
  poolSize: 10,
  bufferMaxEntries: 0,
  useNewUrlParser: true,
};

mongoose.connect(config.mongo.url, options);

if (process.env.NODE_ENV === 'development') {
  mongoose.set('debug', true);
}

mongoose.connection.on('connected', () => {
  logger.debug('connected to mongodb');
});

mongoose.connection.on('error', (e) => {
  logger.error(e.message);
});

mongoose.connection.on('disconnected', () => {
  logger.info('disconnected from mongodb');
});
