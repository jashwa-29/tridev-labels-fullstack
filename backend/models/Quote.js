const mongoose = require('mongoose');

const QuoteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  phone: {
    type: String,
    required: [true, 'Please provide your phone number']
  },
  company: {
    type: String,
    trim: true
  },
  service: {
    type: String,
    // Optional, mainly for service details page
  },
  message: {
    type: String,
    required: [true, 'Please provide a message']
  },
  source: {
    type: String,
    enum: ['service', 'contact'],
    required: true
  },
  status: {
    type: String,
    enum: ['unread', 'read'],
    default: 'unread'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Quote', QuoteSchema);
