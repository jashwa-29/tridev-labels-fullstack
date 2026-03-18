const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  originalId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  modelName: {
    type: String,
    required: true,
    enum: ['Blog', 'Service']
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: ['Edit', 'Delete']
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('History', historySchema);
