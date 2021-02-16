const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String, lowercase: true, trim: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Polygon'],
      required: true
    },
    coordinates: {
      type: [[[Number]]],
      required: true
    }
  }
}, { timestamps: true });

ProductSchema.index({
  name: 1,
});

ProductSchema.index({
  name: 'text',
});

ProductSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Product', ProductSchema);
