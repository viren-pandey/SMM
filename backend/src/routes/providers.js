const express = require('express');
const {
    addProvider,
    getProviders,
    syncServices,
    getProviderBalance
} = require('../controllers/providers');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// All provider routes are admin only
router.use(protect);
router.use(authorize('admin'));

router
    .route('/')
    .post(addProvider)
    .get(getProviders);

router.post('/:id/sync', syncServices);
router.get('/:id/balance', getProviderBalance);

module.exports = router;
