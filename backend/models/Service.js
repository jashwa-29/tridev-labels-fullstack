const mongoose = require('mongoose');

const SubProductSchema = new mongoose.Schema({
  title: { type: String },
  desc: { type: String },
  image: { type: String }
});

const SpecSchema = new mongoose.Schema({
  label: { type: String, required: true },
  value: { type: String, required: true }
});

const ServiceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true
  },
  subtitle: {
    type: String
  },
  description: {
    type: String
  },
  heroImage: {
    type: String
  },
  cardImage: {
    type: String
  },
  subProducts: [SubProductSchema],
  specs: [SpecSchema],
  applications: [String],
  layout: {
    showIntro: { type: Boolean, default: true },
    showShowcase: { type: Boolean, default: true },
    showSolutions: { type: Boolean, default: true },
    showSpecs: { type: Boolean, default: true },
    showApplications: { type: Boolean, default: true }
  },
  sections: [
    {
      heading: String,
      content: String,
      image: String,
      imageAlt: String
    }
  ],
  faqs: [
    {
      question: String,
      answer: String
    }
  ],
  category: { type: String },
  tags: [String],
  extraContent: [mongoose.Schema.Types.Mixed],
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

// Create service slug from the title
ServiceSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  }
  next();
});

module.exports = mongoose.model('Service', ServiceSchema);
