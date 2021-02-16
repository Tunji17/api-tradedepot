const mongoose = require('mongoose');
const { randomBytes, pbkdf2Sync } = require('crypto');
const pick = require('lodash/pick');
const { sign } = require('jsonwebtoken');
const config = require('../config');

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String, lowercase: true, trim: true,
  },
  email: { type: String, trim: true, lowercase: true },
  hash: String,
  salt: String,
  address: String,
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
}, { timestamps: true });

UserSchema.index({
  fullName: 1,
  email: 1,
});

UserSchema.index({
  fullName: 'text',
  email: 'text',
});

UserSchema.index({ location: '2dsphere' });

UserSchema.methods.setPassword = function userPassword(password) {
  this.salt = randomBytes(16).toString('hex');
  this.hash = pbkdf2Sync(password, this.salt, 100, 64, 'sha512').toString('hex');
};

UserSchema.methods.verifyPassword = function verify(password) {
  const hash = pbkdf2Sync(password, this.salt, 100, 64, 'sha512').toString('hex');
  return this.hash === hash;
};

UserSchema.methods.userResponse = function response() {
  return pick(this, [
    '_id',
    'fullName',
    'email',
    'address',
    'location',
  ]);
};

UserSchema.methods.generateToken = function token(time = '7d') {
  return sign(
    {
      _id: this._id,
      fullName: this.fullName,
      email: this.email,
    },
    config.secret, {
      issuer: 'http://tradedepot',
      expiresIn: time,
    },
  );
};

module.exports = mongoose.model('User', UserSchema);