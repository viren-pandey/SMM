const SeoService = require('../services/SeoService');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get sitemap.xml
// @route   GET /api/v1/seo/sitemap.xml
// @access  Public
exports.getSitemap = asyncHandler(async (req, res, next) => {
    const sitemap = await SeoService.generateSitemap();
    res.header('Content-Type', 'application/xml');
    res.status(200).send(sitemap);
});

// @desc    Get robots.txt
// @route   GET /api/v1/seo/robots.txt
// @access  Public
exports.getRobots = (req, res) => {
    const robots = SeoService.getRobotsTxt();
    res.header('Content-Type', 'text/plain');
    res.status(200).send(robots);
};
