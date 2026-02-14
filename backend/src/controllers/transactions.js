const Transaction = require('../models/Transaction');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get user transactions
// @route   GET /api/v1/transactions
// @access  Private
exports.getTransactions = asyncHandler(async (req, res, next) => {
    const query = req.user.role === 'admin' ? {} : { user: req.user.id };

    const transactions = await Transaction.find(query).sort('-createdAt');

    res.status(200).json({
        success: true,
        count: transactions.length,
        data: transactions
    });
});
