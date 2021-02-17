const Joi = require('joi');

const register = Joi.object().keys({
  fullName: Joi.string()
    .min(3)
    .max(30)
    .required()
    .messages({
        'any.required': 'fullName is required.',
        'string.base': 'fullName should be a string.'
      }),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .messages({
      'any.required': 'email is required.',
      'string.base': 'email should be a string.'
    }),
  password: Joi.string()
    .messages({
      'any.required': 'password is required.',
      'string.base': 'password should be a string.'
    }),
  address: Joi.string()
    .required()
    .messages({
        'any.required': 'address is required.',
        'string.base': 'address should be a string.'
      }),
  geoDetails: Joi.array().items(Joi.number()).length(2).required().messages({
    'any.required': 'Coordinates should be an array of latitiude and longitude values.',
    'array.base': 'geoDetails should be an array.'
  }),
});

const login = Joi.object().keys({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .messages({
      'any.required': 'email is required.',
      'string.base': 'email should be a string.'
    }),
  password: Joi.string()
    .messages({
      'any.required': 'password is required.',
      'string.base': 'password should be a string.'
    }),
});

module.exports = {
  register,
  login,
}