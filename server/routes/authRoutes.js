// ─── authRoutes.js ───────────────────────────────────────────
const express = require('express');
const passport = require('passport');
const router = express.Router();
const { register, verifyOTP, login, googleCallback, forgotPassword, resetPassword, refreshToken, logout, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/verify-otp', verifyOTP);
router.post('/login', login);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL}/login?error=google_failed` }), googleCallback);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);
router.get('/me', protect, getMe);

module.exports = router;
