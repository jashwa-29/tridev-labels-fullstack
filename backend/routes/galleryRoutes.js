const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const upload = require('../middleware/upload');
const authMiddleware = require('../middleware/auth');

// Route to create a gallery item
router.post('/', authMiddleware, upload.single('image'), galleryController.createGallery);

// Route to get all gallery items
router.get('/', galleryController.getAllGallery);

// Route to get a specific gallery item by ID
router.get('/:id', galleryController.getGalleryById);

// Route to update a gallery item by ID
router.put('/:id', authMiddleware, upload.single('image'), galleryController.updateGallery);

// Route to delete a gallery item by ID
router.delete('/:id', authMiddleware, galleryController.deleteGallery);

// Route to reorder gallery items
router.post('/reorder', authMiddleware, galleryController.reorderGallery);

module.exports = router;
