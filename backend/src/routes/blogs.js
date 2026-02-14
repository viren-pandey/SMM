const express = require('express');
const {
    getBlogs,
    getBlog,
    createBlog,
    updateBlog,
    deleteBlog
} = require('../controllers/blogs');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.get('/', getBlogs);
router.get('/:slug', getBlog);

// Admin only routes
router.use(protect);
router.use(authorize('admin'));

router.post('/', createBlog);
router.route('/:id')
    .put(updateBlog)
    .delete(deleteBlog);

module.exports = router;
