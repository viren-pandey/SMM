const express = require('express');
const {
    getServices,
    getService,
    updateService,
    deleteService,
    getCategories
} = require('../controllers/services');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.get('/', getServices);
router.get('/categories', getCategories);
router.get('/:id', getService);

// Admin only routes
router.put('/:id', protect, authorize('admin'), updateService);
router.delete('/:id', protect, authorize('admin'), deleteService);

module.exports = router;
