const Quote = require('../models/Quote');
const sendEmail = require('../utils/sendEmail');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Submit a new quote request
// @route   POST /api/quotes
// @access  Public
exports.submitQuote = asyncHandler(async (req, res, next) => {
  const { name, email, phone, company, service, subject, message, details, source } = req.body;

  // 1. Save to database
  const quote = await Quote.create({
    name,
    email,
    phone,
    company: company || subject,
    service: service || (source === 'contact' ? subject : ''),
    message: message || details || subject,
    source
  });

  // 2. Format email content
  const subjectField = subject; // Rename extracted field to avoid collision
  const isQuote = source === 'service';
  const emailLabel = isQuote ? 'Products Quote Enquiry' : 'Contact Page Form';
  const emailSubject = `New Inquiry: ${emailLabel}`;
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #f0f0f0;">
        <h2 style="color: #E32219; margin: 0; text-transform: uppercase; letter-spacing: 2px;">${emailLabel}</h2>
      </div>
      
      <div style="margin-bottom: 25px;">
        <p style="margin: 8px 0; color: #555;"><strong style="color: #000; width: 120px; display: inline-block;">Name:</strong> ${name}</p>
        <p style="margin: 8px 0; color: #555;"><strong style="color: #000; width: 120px; display: inline-block;">Email:</strong> ${email}</p>
        <p style="margin: 8px 0; color: #555;"><strong style="color: #000; width: 120px; display: inline-block;">Phone:</strong> ${phone}</p>
        <p style="margin: 8px 0; color: #555;"><strong style="color: #000; width: 120px; display: inline-block;">Company:</strong> ${company || 'N/A'}</p>
        ${service ? `<p style="margin: 8px 0; color: #555;"><strong style="color: #000; width: 120px; display: inline-block;">Interest:</strong> ${service}</p>` : ''}
      </div>

      <div style="background-color: #f8f8f8; padding: 20px; border-radius: 8px; border-left: 4px solid #E32219;">
        <p style="margin-top: 0; font-weight: bold; color: #000;">Client Message:</p>
        <p style="color: #444; line-height: 1.6; font-style: italic; white-space: pre-wrap;">"${message || details || subject || 'No message provided'}"</p>
      </div>

      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #f0f0f0; text-align: center; font-size: 11px; color: #999;">
        <p>This is a secure automated delivery from the <strong>Tridev Labels</strong> Website Portal.</p>
      </div>
    </div>
  `;

  // 3. Send email notification (Non-blocking)
  sendEmail({ subject: emailSubject, html })
    .then(() => console.log('✅ Background email sent successfully'))
    .catch(err => console.error('❌ Background email failed:', err));

  // 4. Respond immediately to the client
  res.status(201).json({
    success: true,
    data: quote
  });
});

// @desc    Get all quotes
// @route   GET /api/quotes?source=contact|service
// @access  Private/Admin
exports.getAllQuotes = asyncHandler(async (req, res, next) => {
  const { source } = req.query;
  const filter = source ? { source } : {};
  
  const quotes = await Quote.find(filter).sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    count: quotes.length,
    data: quotes
  });
});

// @desc    Get single quote
// @route   GET /api/quotes/:id
// @access  Private/Admin
exports.getQuote = asyncHandler(async (req, res, next) => {
  const quote = await Quote.findById(req.params.id);
  if (!quote) {
    return next(new ErrorResponse(`Quote not found with id of ${req.params.id}`, 404));
  }
  res.status(200).json({
    success: true,
    data: quote
  });
});

// @desc    Update quote (e.g. status)
// @route   PATCH /api/quotes/:id
// @access  Private/Admin
exports.updateQuote = asyncHandler(async (req, res, next) => {
  const quote = await Quote.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!quote) {
    return next(new ErrorResponse(`Quote not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: quote
  });
});

// @desc    Delete quote
// @route   DELETE /api/quotes/:id
// @access  Private/Admin
exports.deleteQuote = asyncHandler(async (req, res, next) => {
  const quote = await Quote.findByIdAndDelete(req.params.id);

  if (!quote) {
    return next(new ErrorResponse(`Quote not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    message: 'Quote deleted successfully'
  });
});
