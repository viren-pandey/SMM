const express = require('express');
const {
    placeOrder,
    getOrders,
    getOrder
} = require('../controllers/orders');

const router = express.Router();

const { protect } = require('../middleware/auth');

const { orderLimiter } = require('../middleware/rateLimiter');

router.use(protect);

router
    .route('/')
    .get(getOrders)
    .post(orderLimiter, placeOrder);

router.route('/:id').get(getOrder);

module.exports = router;
