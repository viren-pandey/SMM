const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const Blog = require('../models/Blog');
const apiResponse = require('../utils/apiResponse');

// @desc    Get all blogs
// @route   GET /api/v1/blogs
// @access  Public
exports.getBlogs = asyncHandler(async (req, res, next) => {
    const query = req.user && req.user.role === 'admin' ? {} : { status: 'published' };

    const blogs = await Blog.find(query)
        .populate('author', 'username')
        .sort('-publishedAt');

    res.status(200).json(apiResponse(true, 'Blogs fetched', blogs));
});

// @desc    Get single blog by slug
// @route   GET /api/v1/blogs/:slug
// @access  Public
exports.getBlog = asyncHandler(async (req, res, next) => {
    const blog = await Blog.findOneAndUpdate(
        { slug: req.params.slug, status: 'published' },
        { $inc: { views: 1 } },
        { new: true }
    ).populate('author', 'username');

    if (!blog) {
        return next(new ErrorResponse('Blog post not found', 404));
    }

    res.status(200).json(apiResponse(true, 'Blog fetched', blog));
});

// @desc    Create blog post
// @route   POST /api/v1/blogs
// @access  Private/Admin
exports.createBlog = asyncHandler(async (req, res, next) => {
    req.body.author = req.user.id;

    if (req.body.content) {
        const wordCount = req.body.content.split(/\s+/).length;
        req.body.readingTime = Math.ceil(wordCount / 200);
    }

    if (req.body.status === 'published' && !req.body.publishedAt) {
        req.body.publishedAt = Date.now();
    }

    const blog = await Blog.create(req.body);

    res.status(201).json(apiResponse(true, 'Blog created', blog));
});

// @desc    Update blog post
// @route   PUT /api/v1/blogs/:id
// @access  Private/Admin
exports.updateBlog = asyncHandler(async (req, res, next) => {
    let blog = await Blog.findById(req.params.id);

    if (!blog) {
        return next(new ErrorResponse('Blog post not found', 404));
    }

    if (req.body.content) {
        const wordCount = req.body.content.split(/\s+/).length;
        req.body.readingTime = Math.ceil(wordCount / 200);
    }

    if (req.body.status === 'published' && !blog.publishedAt) {
        req.body.publishedAt = Date.now();
    }

    blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json(apiResponse(true, 'Blog updated', blog));
});

// @desc    Delete blog post
// @route   DELETE /api/v1/blogs/:id
// @access  Private/Admin
exports.deleteBlog = asyncHandler(async (req, res, next) => {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
        return next(new ErrorResponse('Blog post not found', 404));
    }

    await blog.deleteOne();

    res.status(200).json(apiResponse(true, 'Blog deleted'));
});

