const bunyan = require('bunyan');
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

module.exports = {
  sendJSONResponse,
  catchErrors,
  logger
};
