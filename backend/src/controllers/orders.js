const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const Order = require('../models/Order');
const OrderService = require('../services/OrderService');

// @desc    Place a new order
// @route   POST /api/v1/orders
// @access  Private
exports.placeOrder = asyncHandler(async (req, res, next) => {
    const order = await OrderService.placeOrder(req.user.id, req.body);

    res.status(201).json({
        success: true,
        data: order
    });
});

// @desc    Get user orders
// @route   GET /api/v1/orders
// @access  Private
exports.getOrders = asyncHandler(async (req, res, next) => {
    // Admin can see all, users see only theirs
    const query = req.user.role === 'admin' ? {} : { user: req.user.id };

    const orders = await Order.find(query)
        .populate('service', 'name')
        .sort('-createdAt');

    res.status(200).json({
        success: true,
        count: orders.length,
        data: orders
    });
});

// @desc    Get single order details
// @route   GET /api/v1/orders/:id
// @access  Private
exports.getOrder = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('service');

    if (!order) {
        return next(new ErrorResponse('Order not found', 404));
    }

    // Check ownership
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse('Not authorized to view this order', 403));
    }

    res.status(200).json({
        success: true,
        data: order
    });
});
