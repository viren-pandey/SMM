const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const PaymentProvider = require('../models/PaymentProvider');

// @desc    Get all payment providers
// @route   GET /api/v1/payment-providers
// @access  Public (active only) / Private/Admin (all)
exports.getPaymentProviders = asyncHandler(async (req, res, next) => {
    const query = req.user && req.user.role === 'admin' ? {} : { isActive: true };

    const providers = await PaymentProvider.find(query).sort('displayOrder');

    res.status(200).json({
        success: true,
        count: providers.length,
        data: providers
    });
});

// @desc    Get single payment provider
// @route   GET /api/v1/payment-providers/:id
// @access  Private/Admin
exports.getPaymentProvider = asyncHandler(async (req, res, next) => {
    const provider = await PaymentProvider.findById(req.params.id);

    if (!provider) {
        return next(new ErrorResponse('Payment provider not found', 404));
    }

    res.status(200).json({
        success: true,
        data: provider
    });
});

// @desc    Create payment provider
// @route   POST /api/v1/payment-providers
// @access  Private/Admin
exports.createPaymentProvider = asyncHandler(async (req, res, next) => {
    const provider = await PaymentProvider.create(req.body);

    res.status(201).json({
        success: true,
        data: provider
    });
});

// @desc    Update payment provider
// @route   PUT /api/v1/payment-providers/:id
// @access  Private/Admin
exports.updatePaymentProvider = asyncHandler(async (req, res, next) => {
    let provider = await PaymentProvider.findById(req.params.id);

    if (!provider) {
        return next(new ErrorResponse('Payment provider not found', 404));
    }

    provider = await PaymentProvider.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: provider
    });
});

// @desc    Delete payment provider
// @route   DELETE /api/v1/payment-providers/:id
// @access  Private/Admin
exports.deletePaymentProvider = asyncHandler(async (req, res, next) => {
    const provider = await PaymentProvider.findById(req.params.id);

    if (!provider) {
        return next(new ErrorResponse('Payment provider not found', 404));
    }

    await provider.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    });
});
