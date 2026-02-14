const express = require('express');
const { getOverview, getProviderStats, getTopUsers } = require('../controllers/analytics');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/overview', getOverview);
router.get('/providers', getProviderStats);
router.get('/top-users', getTopUsers);

module.exports = router;
