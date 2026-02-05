// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { login , editCredentials, forgotPassword, resetPassword, verifyOtp } = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

router.post('/login', login);
router.post('/forgotpassword', forgotPassword);
router.post('/verifyotp', verifyOtp);
router.put('/resetpassword', resetPassword);
router.put('/edit-credentials', authMiddleware,  editCredentials);

module.exports = router;

