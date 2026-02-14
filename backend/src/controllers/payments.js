const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

// @desc    Request to add funds (Manual proof)
// @route   POST /api/v1/payments/add-funds
// @access  Private
exports.addFundsManual = asyncHandler(async (req, res, next) => {
    const { amount, paymentMethod, referenceId, description } = req.body;

    const transaction = await Transaction.create({
        user: req.user.id,
        amount,
        type: 'deposit',
        status: 'pending',
        paymentMethod,
        referenceId,
        description: description || 'Add funds request'
    });

    res.status(201).json({
        success: true,
        data: transaction
    });
});

// @desc    Approve/Reject payment (Admin only)
// @route   PUT /api/v1/payments/:id/status
// @access  Private/Admin
exports.updatePaymentStatus = asyncHandler(async (req, res, next) => {
    const { status } = req.body; // 'completed' or 'failed'

    let transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
        return next(new ErrorResponse('Transaction not found', 404));
    }

    if (transaction.status !== 'pending') {
        return next(new ErrorResponse('Transaction already processed', 400));
    }

    if (status === 'completed') {
        const user = await User.findById(transaction.user);
        user.balance = parseFloat((user.balance + transaction.amount).toFixed(4));
        await user.save();
    }

    transaction.status = status;
    await transaction.save();

    res.status(200).json({
        success: true,
        data: transaction
    });
});

// @desc    Get all payments (Admin only)
// @route   GET /api/v1/payments
// @access  Private/Admin
exports.getPayments = asyncHandler(async (req, res, next) => {
    const transactions = await Transaction.find().populate('user', 'username email').sort('-createdAt');

    res.status(200).json({
        success: true,
        count: transactions.length,
        data: transactions
    });
});
