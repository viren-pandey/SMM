const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const config = require('../config/env');

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    // DEBUG: Log cookies and auth header
    console.log('Auth check - Cookies:', req.cookies);
    // console.log('Auth check - Headers:', req.headers.authorization);

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        // Set token from Bearer token in header
        token = req.headers.authorization.split(' ')[1];
    }
    // Set token from cookie
    else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    // Make sure token exists
    if (!token) {
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, config.jwt.secret);

        req.user = await User.findById(decoded.id);

        if (!req.user) {
            return next(new ErrorResponse('User not found', 404));
        }

        if (req.user.isBanned) {
            return next(new ErrorResponse('Your account is banned', 403));
        }

        next();
    } catch (err) {
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }
});

// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorResponse(
                    `User role ${req.user.role} is not authorized to access this route`,
                    403
                )
            );
        }
        next();
    };
};
