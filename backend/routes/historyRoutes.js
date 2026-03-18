const express = require('express');
const router = express.Router();
const {
  getHistory,
  getHistoryRecord,
  deleteHistoryRecord
} = require('../controllers/historyController');
const authMiddleware = require('../middleware/auth');

// All history routes require authentication
router.use(authMiddleware);

router.get('/', getHistory);
router.get('/:id', getHistoryRecord);
router.delete('/:id', deleteHistoryRecord);

module.exports = router;
