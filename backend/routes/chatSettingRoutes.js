const express = require('express');
const { getChatSetting, updateChatSetting } = require('../controllers/chatSettingController');
const protect = require('../middleware/auth');
const authorize = protect.authorize;

const router = express.Router();

router.get('/:key', getChatSetting);
router.post('/', protect, authorize('admin', 'superadmin'), updateChatSetting);

module.exports = router;
