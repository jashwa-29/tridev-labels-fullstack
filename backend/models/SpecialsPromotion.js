const mongoose = require('mongoose');

const SpecialsPromotionSchema = new mongoose.Schema({
  month: { type: String, required: true },  // Store the month for the promotion
  image: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SpecialsPromotion', SpecialsPromotionSchema);
