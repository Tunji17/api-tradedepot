const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  body: {
    type: String, lowercase: true, trim: true,
  },
  replies: [
    {
      body: {
        type: String, lowercase: true, trim: true,
      },
      createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    }
  ],
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

CommentSchema.index({
  body: 1,
});

CommentSchema.index({
  body: 'text',
});


module.exports = mongoose.model('Comment', CommentSchema);
