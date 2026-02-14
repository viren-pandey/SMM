const Blog = require('../models/Blog');
const Service = require('../models/Service');
const config = require('../config/env');

class SeoService {
    /**
     * Generate dynamic sitemap.xml
     */
    static async generateSitemap() {
        const blogs = await Blog.find({ status: 'published' }).select('slug updatedAt');
        // Note: Services could also be included if they have public pages

        let xml = '<?xml version="1.0" encoding="UTF-8"?>';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

        // Add home page
        xml += `<url><loc>${config.frontendUrl}/</loc><priority>1.0</priority></url>`;
        xml += `<url><loc>${config.frontendUrl}/services</loc><priority>0.8</priority></url>`;
        xml += `<url><loc>${config.frontendUrl}/blog</loc><priority>0.8</priority></url>`;

        // Add blogs
        blogs.forEach(blog => {
            xml += `<url>`;
            xml += `<loc>${config.frontendUrl}/blog/${blog.slug}</loc>`;
            xml += `<lastmod>${blog.updatedAt.toISOString().split('T')[0]}</lastmod>`;
            xml += `<priority>0.6</priority>`;
            xml += `</url>`;
        });

        xml += '</urlset>';
        return xml;
    }

    /**
     * Generate robots.txt
     */
    static getRobotsTxt() {
        return `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api

Sitemap: ${config.appUrl}/api/v1/seo/sitemap.xml
`;
    }
}

module.exports = SeoService;
