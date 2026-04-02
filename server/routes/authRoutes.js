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
router.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user, info) => {
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    if (err) {
      const reason = encodeURIComponent(err.message || 'passport_error');
      return res.redirect(`${clientUrl}/login?error=google_failed&reason=${reason}`);
    }
    if (!user) {
      const reason = encodeURIComponent(info?.message || 'user_not_returned');
      return res.redirect(`${clientUrl}/login?error=google_failed&reason=${reason}`);
    }
    req.user = user;
    return googleCallback(req, res, next);
  })(req, res, next);
});
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);
router.get('/me', protect, getMe);

module.exports = router;
