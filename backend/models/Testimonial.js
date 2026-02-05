const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  author: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true
  },
  position: {
    type: String,
    trim: true
  },
  company: {
    type: String,
    trim: true
  },
  text: {
    type: String,
    required: [true, 'Testimonial text is required'],
    trim: true
  },
  impact: {
    type: String,
    trim: true
  },
  industry: {
    type: String,
    trim: true
  },
  tag: {
    type: String,
    trim: true
  },
  image: {
    type: String, // URL to the image
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Testimonial', testimonialSchema);
