const mongoose = require('mongoose');

const History = require('./History');

const blogSchema = new mongoose.Schema({
  cardTitle: { type: String, required: true },
  pageTitle: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String }, // optional: keep for full HTML storage
  sections: [
    {
      heading: String,
      content: String
    }
  ],
  staticHtmlPath: { type: String },
  highlightBox: {
    title: String,
    intro: String,
    points: [String]
  },
  faqs: [
    {
      question: String,
      answer: String
    }
  ],
  category: { type: String },
  tags: [String],
  metaDescription: { type: String },
  publishedDate: { type: Date },
  featuredImage: { type: String }, // main blog image
  author: { type: String, required: true },
  isPublished: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// History Tracking Middleware
blogSchema.pre('save', async function(next) {
  if (!this.isNew) {
    try {
      const original = await this.constructor.findById(this._id);
      if (original) {
        await History.create({
          originalId: this._id,
          modelName: 'Blog',
          data: original.toObject(),
          action: 'Edit'
        });
      }
    } catch (err) {
      console.error('History tracking failed for Blog (Edit):', err);
    }
  }
  next();
});

blogSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
  try {
    await History.create({
      originalId: this._id,
      modelName: 'Blog',
      data: this.toObject(),
      action: 'Delete'
    });
  } catch (err) {
    console.error('History tracking failed for Blog (Delete):', err);
  }
  next();
});

module.exports = mongoose.model('Blog', blogSchema);

