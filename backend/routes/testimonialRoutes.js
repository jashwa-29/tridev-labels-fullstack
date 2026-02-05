const express = require('express');
const router = express.Router();
const testimonialController = require('../controllers/testimonialController');
const upload = require('../middleware/upload');
const authMiddleware = require('../middleware/auth');

// Route to create a testimonial
router.post('/', authMiddleware, upload.single('image'), testimonialController.createTestimonial);

// Route to get all testimonials
router.get('/', testimonialController.getAllTestimonials);

// Route to get a specific testimonial by ID
router.get('/:id', testimonialController.getTestimonialById);

// Route to update a testimonial by ID
router.put('/:id', authMiddleware, upload.single('image'), testimonialController.updateTestimonial);

// Route to delete a testimonial by ID
router.delete('/:id', authMiddleware, testimonialController.deleteTestimonial);

// Route to reorder testimonials
router.post('/reorder', authMiddleware, testimonialController.reorderTestimonials);

module.exports = router;
