const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String, lowercase: true, trim: true,
  },
  maxDistance: Number,
  address: String,
  image: String,
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
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

ProductSchema.index({
  name: 1,
});

ProductSchema.index({
  name: 'text',
});

ProductSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Product', ProductSchema);
