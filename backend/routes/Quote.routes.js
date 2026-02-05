const express = require('express');
const router = express.Router();
const { 
    submitQuote, 
    getAllQuotes, 
    getQuote, 
    updateQuote, 
    deleteQuote 
} = require('../controllers/Quote.controller');
const auth = require('../middleware/auth');

// Public route for submitting quotes
router.post('/', submitQuote);

// Protected routes for admin management
router.get('/', auth, getAllQuotes);
router.get('/:id', auth, getQuote);
router.patch('/:id', auth, updateQuote);
router.delete('/:id', auth, deleteQuote);

module.exports = router;
