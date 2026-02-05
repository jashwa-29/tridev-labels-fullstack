const express = require('express');
const {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
  reorderServices
} = require('../controllers/Service.controller');

const router = express.Router();

const protect = require('../middleware/auth');
const upload = require('../middleware/upload');

router
  .route('/')
  .get(getServices)
  .post(protect, upload.any(), createService);

router.post('/reorder', protect, reorderServices);

router
  .route('/:slug')
  .get(getService);

router
  .route('/admin/:id')
  .patch(protect, upload.any(), updateService)
  .delete(protect, deleteService);

module.exports = router;
