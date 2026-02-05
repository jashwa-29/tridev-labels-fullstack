const Testimonial = require('../models/Testimonial');
const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { getBaseUrl, deleteLocalFile } = require('../utils/helpers');

// @desc    Create a new testimonial
// @route   POST /api/testimonials
// @access  Private
exports.createTestimonial = asyncHandler(async (req, res, next) => {
  const { author, position, company, text, impact, industry, tag, isActive, order } = req.body;

  let image = '';
  if (req.file) {
    const normalizedPath = req.file.path.replace(/\\/g, '/');
    image = `${getBaseUrl(req)}/${normalizedPath}`;
  }

  const testimonial = await Testimonial.create({
    author,
    position,
    company,
    text,
    impact,
    industry,
    tag,
    image,
    isActive: isActive !== undefined ? (isActive === 'true' || isActive === true) : true,
    order: order || 0
  });

  res.status(201).json({
    success: true,
    data: testimonial
  });
});

// @desc    Get all testimonials
// @route   GET /api/testimonials
// @access  Public
exports.getAllTestimonials = asyncHandler(async (req, res, next) => {
  const { admin } = req.query;
  const filter = admin === 'true' ? {} : { isActive: true };
  
  const testimonials = await Testimonial.find(filter).sort({ order: 1, createdAt: -1 });
  
  res.json({
    success: true,
    data: testimonials
  });
});

// @desc    Get single testimonial
// @route   GET /api/testimonials/:id
// @access  Public
exports.getTestimonialById = asyncHandler(async (req, res, next) => {
  const testimonial = await Testimonial.findById(req.params.id);
  if (!testimonial) {
    return next(new ErrorResponse(`Testimonial not found with id of ${req.params.id}`, 404));
  }
  res.json({
    success: true,
    data: testimonial
  });
});

// @desc    Update testimonial
// @route   PUT /api/testimonials/:id
// @access  Private
exports.updateTestimonial = asyncHandler(async (req, res, next) => {
  let testimonial = await Testimonial.findById(req.params.id);
  if (!testimonial) {
    return next(new ErrorResponse(`Testimonial not found with id of ${req.params.id}`, 404));
  }

  const { author, position, company, text, impact, industry, tag, isActive, order } = req.body;

  let imageUrl;
  if (req.file) {
    const normalizedPath = req.file.path.replace(/\\/g, '/');
    imageUrl = `${getBaseUrl(req)}/${normalizedPath}`;

    // Delete old local image
    if (testimonial.image && testimonial.image.includes('/uploads/')) {
      const parts = testimonial.image.split('/uploads/');
      if (parts.length > 1) {
        const relativePath = 'uploads/' + parts[1];
        deleteLocalFile(path.join(__dirname, '..', relativePath));
      }
    }
    testimonial.image = imageUrl;
  }

  testimonial.author = author || testimonial.author;
  testimonial.position = position !== undefined ? position : testimonial.position;
  testimonial.company = company !== undefined ? company : testimonial.company;
  testimonial.text = text || testimonial.text;
  testimonial.impact = impact !== undefined ? impact : testimonial.impact;
  testimonial.industry = industry !== undefined ? industry : testimonial.industry;
  testimonial.tag = tag !== undefined ? tag : testimonial.tag;
  testimonial.isActive = isActive !== undefined ? (isActive === 'true' || isActive === true) : testimonial.isActive;
  testimonial.order = order !== undefined ? order : testimonial.order;
  
  await testimonial.save();

  res.json({
    success: true,
    data: testimonial
  });
});

// @desc    Delete testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private
exports.deleteTestimonial = asyncHandler(async (req, res, next) => {
  const testimonial = await Testimonial.findById(req.params.id);
  if (!testimonial) {
    return next(new ErrorResponse(`Testimonial not found with id of ${req.params.id}`, 404));
  }

  // Delete image from local storage
  if (testimonial.image && testimonial.image.includes('/uploads/')) {
    const parts = testimonial.image.split('/uploads/');
    if (parts.length > 1) {
      const relativePath = 'uploads/' + parts[1];
      deleteLocalFile(path.join(__dirname, '..', relativePath));
    }
  }

  await testimonial.deleteOne();

  res.json({
    success: true,
    message: 'Testimonial deleted successfully'
  });
});

// @desc    Reorder testimonials
// @route   POST /api/testimonials/reorder
// @access  Private
exports.reorderTestimonials = asyncHandler(async (req, res, next) => {
  const { orders } = req.body;

  if (!orders || !Array.isArray(orders)) {
    return next(new ErrorResponse('Invalid orders data', 400));
  }

  const updates = orders.map(item => 
    Testimonial.findByIdAndUpdate(item.id, { order: item.order })
  );

  await Promise.all(updates);

  res.json({
    success: true,
    message: 'Testimonials reordered successfully'
  });
});
