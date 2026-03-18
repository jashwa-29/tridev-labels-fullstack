const Blog = require('../models/Blog');
const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { getBaseUrl, deleteLocalFile, parseJSON, generateUniqueSlug } = require('../utils/helpers');

// @desc    Create a new blog
// @route   POST /api/blogs
// @access  Private
exports.createBlog = asyncHandler(async (req, res, next) => {
  const {
    cardTitle,
    pageTitle,
    content,
    author,
    category,
    sections,
    faqs,
    highlightBox,
    tags,
    metaDescription,
    publishedDate,
    isPublished
  } = req.body;

  if (!cardTitle || !pageTitle || !content) {
    return next(new ErrorResponse('Card title, Page title and content are required', 400));
  }

  let featuredImage = '';
  if (req.file) {
    const normalizedPath = req.file.path.replace(/\\/g, '/');
    featuredImage = `${getBaseUrl(req)}/${normalizedPath}`;
  }

  const slug = await generateUniqueSlug(Blog, cardTitle);

  const blog = new Blog({
    cardTitle,
    pageTitle,
    slug,
    content,
    author: author || 'Anonymous',
    category: category || 'General',
    featuredImage,
    metaDescription: metaDescription || '',
    publishedDate: publishedDate ? new Date(publishedDate) : new Date(),
    isPublished: isPublished === 'true' || isPublished === true,
    sections: parseJSON(sections, []),
    faqs: parseJSON(faqs, []),
    highlightBox: parseJSON(highlightBox, null)
  });

  // Handle Tags
  if (tags) {
    let tagArray = [];
    const parsedTags = parseJSON(tags);
    if (Array.isArray(parsedTags)) {
      tagArray = parsedTags;
    } else if (typeof tags === 'string') {
      tagArray = tags.split(',').map(tag => tag.trim());
    } else if (Array.isArray(tags)) {
      tagArray = tags;
    }
    blog.tags = tagArray.map(t => String(t).trim()).filter(t => t !== "");
  }

  await blog.save();

  res.status(201).json({
    success: true,
    data: blog
  });
});

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
exports.getAllBlogs = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = req.query.admin === 'true' ? {} : { isPublished: true };
  const total = await Blog.countDocuments(filter);
  const blogs = await Blog.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.json({
    success: true,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: blogs,
  });
});

// @desc    Get blog by slug
// @route   GET /api/blogs/:slug
// @access  Public
exports.getBlogBySlug = asyncHandler(async (req, res, next) => {
  const blog = await Blog.findOne({ slug: req.params.slug });

  if (!blog) {
    return next(new ErrorResponse(`Blog not found with slug of ${req.params.slug}`, 404));
  }

  res.json({
    success: true,
    data: blog
  });
});

// @desc    Update a blog
// @route   PUT /api/blogs/:id
// @access  Private
exports.updateBlog = asyncHandler(async (req, res, next) => {
  const {
    cardTitle,
    pageTitle,
    content,
    author,
    category,
    sections,
    faqs,
    highlightBox,
    tags,
    metaDescription,
    publishedDate,
    isPublished
  } = req.body;

  let blog = await Blog.findById(req.params.id);
  if (!blog) {
    return next(new ErrorResponse(`Blog not found with id of ${req.params.id}`, 404));
  }

  // Featured Image Update
  if (req.file) {
    if (blog.featuredImage && blog.featuredImage.includes('/uploads/')) {
      const oldRelativePath = blog.featuredImage.split(req.get('host'))[1];
      if (oldRelativePath) {
        deleteLocalFile(path.join(__dirname, '..', oldRelativePath.substring(1)));
      }
    }
    const normalizedPath = req.file.path.replace(/\\/g, '/');
    blog.featuredImage = `${getBaseUrl(req)}/${normalizedPath}`;
  }

  // Handle Title and Slug (only update slug if cardTitle changes)
  if (cardTitle && cardTitle !== blog.cardTitle) {
    blog.cardTitle = cardTitle;
    blog.slug = await generateUniqueSlug(Blog, cardTitle, blog._id);
  } else if (cardTitle) {
    blog.cardTitle = cardTitle;
  }

  if (pageTitle !== undefined) blog.pageTitle = pageTitle;

  // Update Core Fields
  if (content !== undefined) blog.content = content;
  if (author !== undefined) blog.author = author;
  if (category !== undefined) blog.category = category;
  if (metaDescription !== undefined) blog.metaDescription = metaDescription;
  
  // Handle Booleans Correctly
  if (isPublished !== undefined) {
    blog.isPublished = isPublished === 'true' || isPublished === true;
  }

  // Handle Dates
  if (publishedDate) {
    blog.publishedDate = new Date(publishedDate);
  }

  // Handle Complex JSON Fields
  if (sections) blog.sections = parseJSON(sections, blog.sections);
  if (faqs) blog.faqs = parseJSON(faqs, blog.faqs);
  if (highlightBox) blog.highlightBox = parseJSON(highlightBox, blog.highlightBox);
  
  // Handle Tags Array
  if (tags) {
    let tagArray = [];
    
    // 1. Try to parse if it's a JSON string
    const parsedTags = parseJSON(tags);
    
    if (Array.isArray(parsedTags)) {
      tagArray = parsedTags;
    } else if (typeof tags === 'string') {
      // 2. Handle as comma-separated string
      tagArray = tags.split(',').map(tag => tag.trim());
    } else if (Array.isArray(tags)) {
      // 3. It's already an array
      tagArray = tags;
    }

    if (tagArray.length > 0) {
      blog.tags = tagArray.map(t => String(t).trim()).filter(t => t !== "");
    }
  }

  await blog.save();

  res.json({
    success: true,
    data: blog
  });
});

// @desc    Delete a blog
// @route   DELETE /api/blogs/:id
// @access  Private
exports.deleteBlog = asyncHandler(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    return next(new ErrorResponse(`Blog not found with id of ${req.params.id}`, 404));
  }

  // Delete local file if exists
  if (blog.featuredImage && blog.featuredImage.includes('/uploads/')) {
    const filePath = blog.featuredImage.split(req.get('host'))[1];
    if (filePath) {
      deleteLocalFile(path.join(__dirname, '..', filePath.substring(1)));
    }
  }

  await blog.deleteOne();

  res.json({
    success: true,
    message: 'Blog deleted successfully'
  });
});
