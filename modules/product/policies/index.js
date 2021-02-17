const Joi = require('joi');


const create = Joi.object().keys({
  image: Joi.any(),
  name: Joi.string()
    .min(3)
    .max(30)
    .required()
    .messages({
      'any.required': 'name is required.',
      'string.base': 'name should be a string.'
    }),
    distanceInMeters: Joi.number()
    .required()
    .messages({
      'any.required': 'distanceInMeters is required.',
      'number.base': 'distanceInMeters should be a number.'
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


const createComments = Joi.object().keys({
  body: Joi.string()
    .min(3)
    .max(300)
    .required()
    .messages({
      'any.required': 'body is required.',
      'string.base': 'body should be a string.'
    }),
    productId: Joi.string()
    .required()
    .messages({
      'any.required': 'productId is required.',
      'string.base': 'productId should be a string.'
    }),
    commentId: Joi.string()
    .messages({
      'any.required': 'commentId is required.',
      'string.base': 'commentId should be a string.'
    }),
});

module.exports = {
  create,
  createComments,
}