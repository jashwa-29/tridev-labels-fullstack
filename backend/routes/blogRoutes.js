const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const upload = require('../middleware/upload');
const authMiddleware = require('../middleware/auth');

// Route to create a new blog with image upload
router.post('/', authMiddleware, upload.single('featuredImage'), blogController.createBlog);

// Route to get all blogs
router.get('/',  blogController.getAllBlogs);

// Route to get a specific blog by ID
router.get('/slug/:slug', blogController.getBlogBySlug);

// Route to update a blog by ID with optional new image
router.put('/:id', authMiddleware, upload.single('featuredImage'), blogController.updateBlog);

// Route to delete a blog by ID
router.delete('/:id', authMiddleware, blogController.deleteBlog);

module.exports = router;
