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
    title,
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

  if (!title || !content) {
    return next(new ErrorResponse('Title and content are required', 400));
  }

  let featuredImage = '';
  if (req.file) {
    const normalizedPath = req.file.path.replace(/\\/g, '/');
    featuredImage = `${getBaseUrl(req)}/${normalizedPath}`;
  }

  const slug = await generateUniqueSlug(Blog, title);

  const blog = new Blog({
    title,
    slug,
    content,
    author: author || 'Anonymous',
    category,
    featuredImage,
    sections: parseJSON(sections, []),
    faqs: parseJSON(faqs, []),
    highlightBox: parseJSON(highlightBox, null),
    tags: Array.isArray(tags)
      ? tags.map(tag => tag.trim())
      : typeof tags === 'string'
        ? tags.split(',').map(tag => tag.trim())
        : [],
    metaDescription,
    publishedDate: publishedDate ? new Date(publishedDate) : null,
    isPublished: isPublished === 'true' || isPublished === true
  });

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
    title,
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

  if (req.file) {
    if (blog.featuredImage && blog.featuredImage.includes('/uploads/')) {
      const oldPath = blog.featuredImage.split(req.get('host'))[1];
      if (oldPath) {
        deleteLocalFile(path.join(__dirname, '..', oldPath.substring(1)));
      }
    }
    const normalizedPath = req.file.path.replace(/\\/g, '/');
    blog.featuredImage = `${getBaseUrl(req)}/${normalizedPath}`;
  }

  if (title) {
    blog.title = title;
    blog.slug = await generateUniqueSlug(Blog, title, blog._id);
  }

  blog.content = content ?? blog.content;
  blog.author = author ?? blog.author;
  blog.category = category ?? blog.category;
  blog.sections = sections ? parseJSON(sections, blog.sections) : blog.sections;
  blog.faqs = faqs ? parseJSON(faqs, blog.faqs) : blog.faqs;
  blog.highlightBox = highlightBox ? parseJSON(highlightBox, blog.highlightBox) : blog.highlightBox;
  blog.tags = Array.isArray(tags)
    ? tags.map(tag => tag.trim())
    : typeof tags === 'string'
      ? tags.split(',').map(tag => tag.trim())
      : blog.tags;
  blog.metaDescription = metaDescription ?? blog.metaDescription;
  blog.publishedDate = publishedDate ? new Date(publishedDate) : blog.publishedDate;
  blog.isPublished = isPublished === 'true' || isPublished === true || blog.isPublished;

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
