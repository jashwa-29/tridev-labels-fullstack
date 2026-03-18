const mongoose = require('mongoose');
const History = require('./History');

const SpecSchema = new mongoose.Schema({
  label: { type: String, required: true },
  value: { type: String, required: true }
});

const SubProductSchema = new mongoose.Schema({
  title: { type: String },
  slug: { type: String },
  subtitle: { type: String },
  desc: { type: String },
  fullDescription: { type: String },
  metaTitle: { type: String }, // Details page title
  metaDescription: { type: String }, // Details page meta description
  features: [String],
  specifications: [SpecSchema],
  applications: [String],
  benefits: [String],
  faqs: [
    {
      question: String,
      answer: String
    }
  ],
  sections: [
    {
      heading: String,
      content: String,
      image: String,
      imageAlt: String
    }
  ],
  image: { type: String },
  imageAlt: { type: String }, // Alt text for sub-product image
  gallery: [
    {
      url: String,
      alt: String
    }
  ]
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
  metaTitle: {
    type: String
  },
  metaDescription: {
    type: String
  },
  heroImage: {
    type: String
  },
  heroImageAlt: {
    type: String // Alt text for hero image
  },
  cardImage: {
    type: String
  },
  cardImageAlt: {
    type: String // Alt text for card image
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

// Slug Generation Middleware
ServiceSchema.pre('save', function(next) {
  if (this.isModified('title') && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  }

  if (this.subProducts && this.subProducts.length > 0) {
    this.subProducts.forEach(subProduct => {
      if (subProduct.title && !subProduct.slug) {
        subProduct.slug = subProduct.title
          .toLowerCase()
          .replace(/[^\w ]+/g, '')
          .replace(/ +/g, '-');
      }
    });
  }
  
  next();
});

// History Tracking Middleware
ServiceSchema.pre('save', async function(next) {
  if (!this.isNew) {
    try {
      const original = await this.constructor.findById(this._id);
      if (original) {
        await History.create({
          originalId: this._id,
          modelName: 'Service',
          data: original.toObject(),
          action: 'Edit'
        });
      }
    } catch (err) {
      console.error('History tracking failed for Service (Edit):', err);
    }
  }
  next();
});

ServiceSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
  try {
    await History.create({
      originalId: this._id,
      modelName: 'Service',
      data: this.toObject(),
      action: 'Delete'
    });
  } catch (err) {
    console.error('History tracking failed for Service (Delete):', err);
  }
  next();
});

module.exports = mongoose.model('Service', ServiceSchema);

