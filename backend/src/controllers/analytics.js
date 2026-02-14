const asyncHandler = require('../middleware/asyncHandler');
const AnalyticsService = require('../services/AnalyticsService');
const apiResponse = require('../utils/apiResponse');

// @desc    Get dashboard overview stats
// @route   GET /api/v1/analytics/overview
// @access  Private/Admin
exports.getOverview = asyncHandler(async (req, res, next) => {
    const stats = await AnalyticsService.getOverviewStats();
    res.status(200).json(apiResponse(true, 'Overview stats fetched', stats));
});

// @desc    Get provider performance metrics
// @route   GET /api/v1/analytics/providers
// @access  Private/Admin
exports.getProviderStats = asyncHandler(async (req, res, next) => {
    const stats = await AnalyticsService.getProviderPerformance();
    res.status(200).json(apiResponse(true, 'Provider stats fetched', stats));
});

// @desc    Get top user spenders
// @route   GET /api/v1/analytics/top-users
// @access  Private/Admin
exports.getTopUsers = asyncHandler(async (req, res, next) => {
    const stats = await AnalyticsService.getTopSpenders();
    res.status(200).json(apiResponse(true, 'Top users fetched', stats));
});
