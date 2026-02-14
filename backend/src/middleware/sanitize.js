/**
 * Custom Sanitize Middleware for Express 5
 * 1. MongoDB: Recursively removes any keys starting with '$' or containing '.'
 * 2. XSS: Recursively strips HTML tags from strings.
 * Mutates objects in-place to avoid Express 5 read-only property issues (e.g., req.query).
 */

const cleanXSS = (str) => {
    if (typeof str !== 'string') return str;
    return str.replace(/<[^>]*>?/gm, ''); // Simple tag stripping like xss-clean
};

const sanitize = (obj) => {
    if (obj && typeof obj === 'object') {
        Object.keys(obj).forEach((key) => {
            // MongoDB Sanitization
            if (key.startsWith('$') || key.includes('.')) {
                delete obj[key];
            } else {
                const value = obj[key];
                if (typeof value === 'string') {
                    // XSS Sanitization
                    obj[key] = cleanXSS(value);
                } else if (value && typeof value === 'object') {
                    sanitize(value);
                }
            }
        });
    }
    return obj;
};

const sanitizeMiddleware = (req, res, next) => {
    if (req.body) sanitize(req.body);
    if (req.query) sanitize(req.query);
    if (req.params) sanitize(req.params);
    next();
};

module.exports = sanitizeMiddleware;
