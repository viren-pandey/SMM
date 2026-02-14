const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const Provider = require('../models/Provider');
const ServiceManager = require('../services/ServiceManager');
const ProviderService = require('../services/ProviderService');

// @desc    Add a provider
// @route   POST /api/v1/providers
// @access  Private/Admin
exports.addProvider = asyncHandler(async (req, res, next) => {
    const provider = await Provider.create(req.body);

    res.status(201).json({
        success: true,
        data: provider
    });
});

// @desc    Get all providers
// @route   GET /api/v1/providers
// @access  Private/Admin
exports.getProviders = asyncHandler(async (req, res, next) => {
    const providers = await Provider.find();

    res.status(200).json({
        success: true,
        count: providers.length,
        data: providers
    });
});

// @desc    Sync services from provider
// @route   POST /api/v1/providers/:id/sync
// @access  Private/Admin
exports.syncServices = asyncHandler(async (req, res, next) => {
    const provider = await Provider.findById(req.params.id);

    if (!provider) {
        return next(new ErrorResponse('Provider not found', 404));
    }

    await ServiceManager.syncFromProvider(provider);

    res.status(200).json({
        success: true,
        data: 'Services synced successfully'
    });
});

// @desc    Get provider balance from API
// @route   GET /api/v1/providers/:id/balance
// @access  Private/Admin
exports.getProviderBalance = asyncHandler(async (req, res, next) => {
    const provider = await Provider.findById(req.params.id);

    if (!provider) {
        return next(new ErrorResponse('Provider not found', 404));
    }

    const balanceData = await ProviderService.getBalance(provider);

    res.status(200).json({
        success: true,
        data: balanceData
    });
});
