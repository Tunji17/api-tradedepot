const Joi = require('joi');


const create = Joi.object().keys({
  // image: Joi.string()
  //   .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
  //   .messages({
  //     'any.required': 'email is required.',
  //     'string.base': 'email should be a string.'
  //   }),
  name: Joi.string()
    .min(3)
    .max(30)
    .required()
    .messages({
      'any.required': 'name is required.',
      'string.base': 'name should be a string.'
    }),
    // distanceInMeters: Joi.number()
    // .required()
    // .messages({
    //   'any.required': 'maxDistance is required.',
    //   'number.base': 'maxDistance should be a number.'
    // }),
    geoDetails: Joi.array().required().messages({
      'any.required': 'Coordinates should be a nested array of latitiude and longitude values.',
      'array.base': 'geoDetails should be an array.'
    }),
});

module.exports = {
  create,
}