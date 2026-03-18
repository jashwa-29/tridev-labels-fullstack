const Chat = require('../models/Chat');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all closed chats (history)
// @route   GET /api/chats/history
// @access  Private/Admin
exports.getChatHistory = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;

  const total = await Chat.countDocuments({ status: 'closed' });

  const chats = await Chat.find({ status: 'closed' })
    .populate('assignedTo', 'name email')
    .sort({ lastMessageAt: -1 })
    .skip(startIndex)
    .limit(limit);

  res.status(200).json({
    success: true,
    total,
    count: chats.length,
    data: chats
  });
});

// @desc    Get single chat details
// @route   GET /api/chats/:id
// @access  Private/Admin
exports.getChat = asyncHandler(async (req, res, next) => {
  const chat = await Chat.findById(req.params.id).populate('assignedTo', 'name email');

  if (!chat) {
    return next(new ErrorResponse(`Chat not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: chat
  });
});
