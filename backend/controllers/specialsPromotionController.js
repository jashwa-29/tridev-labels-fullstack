const path = require('path');
const SpecialsPromotion = require('../models/SpecialsPromotion');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { getBaseUrl, deleteLocalFile } = require('../utils/helpers');

// @desc    Create a new specials promotion item
// @route   POST /api/specialsPromotions
// @access  Private
exports.createSpecialsPromotion = asyncHandler(async (req, res, next) => {
  const { month } = req.body;
  const file = req.file;

  if (!month || !file) {
    if (file) deleteLocalFile(file.path);
    return next(new ErrorResponse('Month and image are required for the promotion', 400));
  }

  const normalizedPath = file.path.replace(/\\/g, '/');
  const imageUrl = `${getBaseUrl(req)}/${normalizedPath}`;

  const promotion = await SpecialsPromotion.create({
    month,
    image: imageUrl,
  });

  res.status(201).json({
    success: true,
    data: promotion
  });
});  

// @desc    Get all specials promotion items
// @route   GET /api/specialsPromotions
// @access  Public
exports.getAllSpecialsPromotion = asyncHandler(async (req, res, next) => {
  const promotions = await SpecialsPromotion.find().sort({ createdAt: -1 });
  res.json({
    success: true,
    data: promotions
  });
});

// @desc    Get single specials promotion item
// @route   GET /api/specialsPromotions/:id
// @access  Public
exports.getSpecialsPromotionById = asyncHandler(async (req, res, next) => {
  const promotion = await SpecialsPromotion.findById(req.params.id);
  if (!promotion) {
    return next(new ErrorResponse(`Specials promotion item not found with id of ${req.params.id}`, 404));
  }
  res.json({
    success: true,
    data: promotion
  });
});

// @desc    Update a specials promotion item
// @route   PUT /api/specialsPromotions/:id
// @access  Private
exports.updateSpecialsPromotion = asyncHandler(async (req, res, next) => {
  const { month } = req.body;
  const file = req.file;

  let promotion = await SpecialsPromotion.findById(req.params.id);
  if (!promotion) {
    if (file) deleteLocalFile(file.path);
    return next(new ErrorResponse(`Specials promotion item not found with id of ${req.params.id}`, 404));
  }

  if (file) {
    // Delete old local image
    if (promotion.image && promotion.image.includes('/uploads/')) {
      const oldPath = promotion.image.split(req.get('host'))[1];
      if (oldPath) {
        deleteLocalFile(path.join(__dirname, '..', oldPath.substring(1)));
      }
    }

    const normalizedPath = file.path.replace(/\\/g, '/');
    promotion.image = `${getBaseUrl(req)}/${normalizedPath}`;
  }

  if (month) promotion.month = month;

  await promotion.save();

  res.json({
    success: true,
    data: promotion
  });
});

// @desc    Delete a specials promotion item
// @route   DELETE /api/specialsPromotions/:id
// @access  Private
exports.deleteSpecialsPromotion = asyncHandler(async (req, res, next) => {
  const promotion = await SpecialsPromotion.findById(req.params.id);
  if (!promotion) {
    return next(new ErrorResponse(`Specials promotion item not found with id of ${req.params.id}`, 404));
  }

  // Delete image from local storage
  if (promotion.image && promotion.image.includes('/uploads/')) {
    const oldPath = promotion.image.split(req.get('host'))[1];
    if (oldPath) {
      deleteLocalFile(path.join(__dirname, '..', oldPath.substring(1)));
    }
  }

  await promotion.deleteOne();

  res.json({
    success: true,
    message: 'Specials promotion item deleted successfully'
  });
});

