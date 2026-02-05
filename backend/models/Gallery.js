const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  name: { type: String, required: true },
  benefit: { type: String, required: false },
  description: { type: String, required: false },
  image: { type: String, required: true },  // Image filename or full URL
  icon: { type: String, required: false },  // Icon name/identifier
  category: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Gallery', gallerySchema);
