const express = require('express');
const { getChatHistory, getChat } = require('../controllers/chatController');
const protect = require('../middleware/auth');
const authorize = protect.authorize;

const router = express.Router();

router.use(protect);
router.use(authorize('admin', 'superadmin'));

router.get('/history', getChatHistory);
router.get('/:id', getChat);

module.exports = router;
