const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const Service = require('../models/Service');
const Category = require('../models/Category');

// @desc    Get all services
// @route   GET /api/v1/services
// @access  Public
exports.getServices = asyncHandler(async (req, res, next) => {
    const services = await Service.find({ status: 'active' }).populate({
        path: 'category',
        select: 'name'
    });

    res.status(200).json({
        success: true,
        count: services.length,
        data: services
    });
});

// @desc    Get single service
// @route   GET /api/v1/services/:id
// @access  Public
exports.getService = asyncHandler(async (req, res, next) => {
    const service = await Service.findById(req.params.id).populate('category');

    if (!service) {
        return next(new ErrorResponse('Service not found', 404));
    }

    res.status(200).json({
        success: true,
        data: service
    });
});

// @desc    Update service margin or price
// @route   PUT /api/v1/services/:id
// @access  Private/Admin
exports.updateService = asyncHandler(async (req, res, next) => {
    let service = await Service.findById(req.params.id);

    if (!service) {
        return next(new ErrorResponse('Service not found', 404));
    }

    service = await Service.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    // Pre-save price recalculation happens in Mongoose hook
    await service.save();

    res.status(200).json({
        success: true,
        data: service
    });
});

// @desc    Delete service
// @route   DELETE /api/v1/services/:id
// @access  Private/Admin
exports.deleteService = asyncHandler(async (req, res, next) => {
    const service = await Service.findById(req.params.id);

    if (!service) {
        return next(new ErrorResponse('Service not found', 404));
    }

    await service.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    });
});

// @desc    Get categories
// @route   GET /api/v1/categories
// @access  Public
exports.getCategories = asyncHandler(async (req, res, next) => {
    const categories = await Category.find({ status: 'active' }).sort('sortOrder');

    res.status(200).json({
        success: true,
        count: categories.length,
        data: categories
    });
});
