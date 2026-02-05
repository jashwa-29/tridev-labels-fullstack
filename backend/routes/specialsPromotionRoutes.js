const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const specialsPromotionController = require('../controllers/specialsPromotionController');
const authMiddleware = require('../middleware/auth');

// Routes for specials promotions
router.post('/', authMiddleware, upload.single('image'), specialsPromotionController.createSpecialsPromotion);
router.get('/', specialsPromotionController.getAllSpecialsPromotion);
router.get('/:id', specialsPromotionController.getSpecialsPromotionById);
router.put('/:id', authMiddleware, upload.single('image'), specialsPromotionController.updateSpecialsPromotion);
router.delete('/:id', authMiddleware, specialsPromotionController.deleteSpecialsPromotion);

module.exports = router;
