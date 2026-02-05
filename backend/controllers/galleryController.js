const Gallery = require('../models/Gallery');
const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { getBaseUrl, deleteLocalFile } = require('../utils/helpers');

// @desc    Create a new gallery item
// @route   POST /api/gallery
// @access  Private
exports.createGallery = asyncHandler(async (req, res, next) => {
  const { name, benefit, description, category, icon, isActive, order } = req.body;

  if (!req.file) {
    return next(new ErrorResponse('Image is required', 400));
  }

  const normalizedPath = req.file.path.replace(/\\/g, '/');
  const imageUrl = `${getBaseUrl(req)}/${normalizedPath}`;

  const galleryItem = await Gallery.create({
    name,
    benefit,
    description,
    image: imageUrl,
    category: category || 'General',
    icon,
    isActive: isActive !== undefined ? isActive : true,
    order: order || 0
  });

  res.status(201).json({
    success: true,
    data: galleryItem
  });
});

// @desc    Get all gallery items
// @route   GET /api/gallery
// @access  Public
exports.getAllGallery = asyncHandler(async (req, res, next) => {
  const { admin } = req.query;
  const filter = admin === 'true' ? {} : { isActive: true };
  
  const galleryItems = await Gallery.find(filter).sort({ order: 1, createdAt: -1 });
  res.json({
    success: true,
    data: galleryItems
  });
});

// @desc    Get single gallery item
// @route   GET /api/gallery/:id
// @access  Public
exports.getGalleryById = asyncHandler(async (req, res, next) => {
  const galleryItem = await Gallery.findById(req.params.id);
  if (!galleryItem) {
    return next(new ErrorResponse(`Gallery item not found with id of ${req.params.id}`, 404));
  }
  res.json({
    success: true,
    data: galleryItem
  });
});

// @desc    Update gallery item
// @route   PUT /api/gallery/:id
// @access  Private
exports.updateGallery = asyncHandler(async (req, res, next) => {
  const { name, benefit, description, category, icon, isActive, order } = req.body;
  
  let galleryItem = await Gallery.findById(req.params.id);
  if (!galleryItem) {
    return next(new ErrorResponse(`Gallery item not found with id of ${req.params.id}`, 404));
  }

  let imageUrl;
  if (req.file) {
    const normalizedPath = req.file.path.replace(/\\/g, '/');
    imageUrl = `${getBaseUrl(req)}/${normalizedPath}`;

    // Delete old local image
    if (galleryItem.image && galleryItem.image.includes('/uploads/')) {
      const parts = galleryItem.image.split('/uploads/');
      if (parts.length > 1) {
        const relativePath = 'uploads/' + parts[1];
        deleteLocalFile(path.join(__dirname, '..', relativePath));
      }
    }
  }

  galleryItem.name = name || galleryItem.name;
  galleryItem.benefit = benefit !== undefined ? benefit : galleryItem.benefit;
  galleryItem.description = description !== undefined ? description : galleryItem.description;
  galleryItem.category = category || galleryItem.category;
  galleryItem.icon = icon !== undefined ? icon : galleryItem.icon;
  galleryItem.isActive = isActive !== undefined ? isActive : galleryItem.isActive;
  galleryItem.order = order !== undefined ? order : galleryItem.order;
  
  if (imageUrl) {
    galleryItem.image = imageUrl;
  }

  await galleryItem.save();

  res.json({
    success: true,
    data: galleryItem
  });
});

// @desc    Delete gallery item
// @route   DELETE /api/gallery/:id
// @access  Private
exports.deleteGallery = asyncHandler(async (req, res, next) => {
  const galleryItem = await Gallery.findById(req.params.id);
  if (!galleryItem) {
    return next(new ErrorResponse(`Gallery item not found with id of ${req.params.id}`, 404));
  }

  // Delete image from local storage
  if (galleryItem.image && galleryItem.image.includes('/uploads/')) {
    const parts = galleryItem.image.split('/uploads/');
    if (parts.length > 1) {
      const relativePath = 'uploads/' + parts[1];
      deleteLocalFile(path.join(__dirname, '..', relativePath));
    }
  }

  await galleryItem.deleteOne();

  res.json({
    success: true,
    message: 'Gallery item deleted successfully'
  });
});

// @desc    Reorder gallery items
// @route   POST /api/gallery/reorder
// @access  Private
exports.reorderGallery = asyncHandler(async (req, res, next) => {
  const { orders } = req.body;

  if (!orders || !Array.isArray(orders)) {
    return next(new ErrorResponse('Invalid orders data', 400));
  }

  const updates = orders.map(item => 
    Gallery.findByIdAndUpdate(item.id, { order: item.order })
  );

  await Promise.all(updates);

  res.json({
    success: true,
    message: 'Gallery reordered successfully'
  });
});
