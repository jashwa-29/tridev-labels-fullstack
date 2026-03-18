const ChatSetting = require('../models/ChatSetting');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get chat settings by key
// @route   GET /api/chat-settings/:key
// @access  Public
exports.getChatSetting = asyncHandler(async (req, res, next) => {
  const setting = await ChatSetting.findOne({ key: req.params.key });

  if (!setting) {
    // Return default values if not found in DB
    let defaultValue = [];
    if (req.params.key === 'visitor_faqs') {
      defaultValue = [
        { label: 'Branding Solutions', value: 'I have an inquiry about Tridev Labels branding products.' },
        { label: 'Bulk Order Quotation', value: 'I would like to discuss a massive bulk order.' },
        { label: 'Label Customization', value: 'I need help with customizing my labels.' },
        { label: 'Pricing List', value: 'Can you provide a pricing list for your services?' }
      ];
    } else if (req.params.key === 'admin_canned_replies') {
      defaultValue = [
        { label: 'Greet', value: 'Hello! Welcome to Tridev Labels. How can I assist you today?' },
        { label: 'Wait', value: 'Please wait a moment while I check the manufacturing details for you.' },
        { label: 'Done', value: 'Your request has been processed. Is there anything else I can help with?' },
        { label: 'Thanks', value: 'Thank you for choosing Tridev Labels. Have a great day!' }
      ];
    }
    
    return res.status(200).json({
      success: true,
      data: defaultValue
    });
  }

  res.status(200).json({
    success: true,
    data: setting.value
  });
});

// @desc    Update chat settings
// @route   POST /api/chat-settings
// @access  Private/Admin
exports.updateChatSetting = asyncHandler(async (req, res, next) => {
  const { key, value } = req.body;

  let setting = await ChatSetting.findOne({ key });

  if (setting) {
    setting.value = value;
    await setting.save();
  } else {
    setting = await ChatSetting.create({ key, value });
  }

  res.status(200).json({
    success: true,
    data: setting.value
  });
});
