const { verify } = require('jsonwebtoken');
const { promisify } = require('util');
const { sendJSONResponse } = require('../utils')
const config = require('../config')

const verifyToken = promisify(verify);

  const validateSchema = (schema) => {
    return (req, res, next) => {
      const result = schema.validate(req.body);
      if( result.error ) {
        return sendJSONResponse(res, result.error.details[0].message, 'error', 400, null);
      }else {
        next();
      }
    }
  };

  const authenticate = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
      return sendJSONResponse(res, 'Authentication Failed, Please provide an authentication token', 'error', 400, null);
    }
    try {
      const decoded = await verifyToken(token, config.secret);
      req.decoded = decoded;
      return next();
    } catch (error) {
      return sendJSONResponse(res, 'Authentication Failed', 'error', 400, null);
    }
  };
  

  module.exports = {
    validateSchema,
    authenticate
  };
