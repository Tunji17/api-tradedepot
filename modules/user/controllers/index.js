const mongoose = require('mongoose');
const { sendJSONResponse } = require('../../../utils');


const register = async (req, res) => {
  const {
    fullName,
    email,
    password,
    address,
    geoDetails,
  } = req.body;

  const existingUser = await mongoose.model('User').findOne({ email });

  if (existingUser) {
    return sendJSONResponse(res, 'An account with this email already exists', 'error', 400, null );
  }

  const user = new (mongoose.model('User'))();

  user.fullName = fullName;
  user.email = email;
  user.address = address;
  user.location = {
    type: 'Point',
    coordinates: geoDetails
  };
  user.setPassword(password);
  await user.save();
  const token = user.generateToken();
  const data = {
    token,
    user: user.userResponse(),
  }
  return sendJSONResponse(res, 'Account successfully created', 'success', 200, data );
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await mongoose.model('User').findOne({ email })

  if (!user) return sendJSONResponse(res, 'Invalid Credentials', 'error', 400, null );

  const validPassword = user.verifyPassword(password);

  if (!validPassword) return sendJSONResponse(res, 'Invalid Credentials', 'error', 400, null );

  const token = user.generateToken();
  const data = {
    token,
    user: user.userResponse(),
  }
  return sendJSONResponse(res, 'Login successfully', 'success', 200, data );
};

module.exports = {
  register,
  login,
}