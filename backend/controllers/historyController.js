const History = require('../models/History');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all history records
// @route   GET /api/history
// @access  Private/Admin
exports.getHistory = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const total = await History.countDocuments();
  const history = await History.find()
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: history.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: history
  });
});

// @desc    Get single history record
// @route   GET /api/history/:id
// @access  Private/Admin
exports.getHistoryRecord = asyncHandler(async (req, res, next) => {
  const history = await History.findById(req.params.id);

  if (!history) {
    return next(new ErrorResponse(`History record not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: history
  });
});

// @desc    Delete a history record
// @route   DELETE /api/history/:id
// @access  Private/Admin
exports.deleteHistoryRecord = asyncHandler(async (req, res, next) => {
  const history = await History.findById(req.params.id);

  if (!history) {
    return next(new ErrorResponse(`History record not found with id of ${req.params.id}`, 404));
  }

  await history.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});
