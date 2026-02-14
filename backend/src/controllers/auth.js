const otplib = require('otplib');
const qrcode = require('qrcode');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const User = require('../models/User');
const apiResponse = require('../utils/apiResponse');
const config = require('../config/env');

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
    const { username, email, password } = req.body;

    // Create user
    const user = await User.create({
        username,
        email,
        password
    });

    sendTokenResponse(user, 201, res);
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password, twoFactorToken } = req.body;

    // Validate email & password
    if (!email || !password) {
        return next(new ErrorResponse('Please provide an email and password', 400));
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password +twoFactorSecret');

    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check if 2FA is enabled
    if (user.twoFactorEnabled) {
        if (!twoFactorToken) {
            return res.status(200).json(apiResponse(true, '2FA token required', { twoFactorRequired: true }));
        }

        const isValid = otplib.authenticator.check(twoFactorToken, user.twoFactorSecret);
        if (!isValid) {
            return next(new ErrorResponse('Invalid 2FA token', 401));
        }
    }

    sendTokenResponse(user, 200, res);
});

// @desc    Generate 2FA secret and QR code
// @route   POST /api/v1/auth/2fa/generate
// @access  Private
exports.generate2FA = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    const secret = otplib.authenticator.generateSecret();
    const otpauth = otplib.authenticator.keyuri(user.email, 'SMM Enterprise', secret);
    const qrCodeUrl = await qrcode.toDataURL(otpauth);

    user.twoFactorSecret = secret;
    await user.save();

    res.status(200).json(apiResponse(true, '2FA setup generated', { qrCodeUrl, secret }));
});

// @desc    Verify 2FA token and enable 2FA
// @route   POST /api/v1/auth/2fa/verify
// @access  Private
exports.verify2FA = asyncHandler(async (req, res, next) => {
    const { token } = req.body;
    const user = await User.findById(req.user.id).select('+twoFactorSecret');

    if (!token) {
        return next(new ErrorResponse('Please provide a 2FA token', 400));
    }

    const isValid = otplib.authenticator.check(token, user.twoFactorSecret);

    if (!isValid) {
        return next(new ErrorResponse('Invalid 2FA token', 401));
    }

    user.twoFactorEnabled = true;
    await user.save();

    res.status(200).json(apiResponse(true, '2FA enabled successfully'));
});

// @desc    Disable 2FA
// @route   POST /api/v1/auth/2fa/disable
// @access  Private
exports.disable2FA = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    user.twoFactorEnabled = false;
    user.twoFactorSecret = undefined;
    await user.save();

    res.status(200).json(apiResponse(true, '2FA disabled successfully'));
});

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json(apiResponse(true, 'User data fetched', user));
});

// @desc    Log user out / clear cookie
// @route   GET /api/v1/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
        path: '/',
        sameSite: 'lax'
    });

    res.status(200).json(apiResponse(true, 'Logged out successfully'));
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(
            Date.now() + (process.env.JWT_COOKIE_EXPIRE || 30) * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        path: '/',
        sameSite: 'lax'
    };

    if (config.env === 'production') {
        options.secure = true;
    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json(apiResponse(true, 'Authentication successful', {
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        }));
};

