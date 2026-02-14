const express = require('express');
const {
    register,
    login,
    logout,
    getMe
} = require('../controllers/auth');

const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', authLimiter, login);
router.get('/logout', logout);
router.get('/me', protect, getMe);

// 2FA Routes
const { generate2FA, verify2FA, disable2FA } = require('../controllers/auth');
router.post('/2fa/generate', protect, generate2FA);
router.post('/2fa/verify', protect, verify2FA);
router.post('/2fa/disable', protect, disable2FA);

module.exports = router;
