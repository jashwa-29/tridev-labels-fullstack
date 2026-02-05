const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
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

module.exports = mongoose.model('Blog', blogSchema);
