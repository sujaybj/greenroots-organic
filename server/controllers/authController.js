// ─── server/controllers/authController.js ───────────────────
const crypto  = require('crypto');
const User    = require('../models/User');
const {
  sendTokenResponse, sendOTPEmail, sendPasswordResetEmail,
  generateAccessToken, generateRefreshToken,
} = require('../utils/tokenUtils');
const {
  sendOTPWhatsApp, sendPasswordResetWhatsApp,
} = require('../utils/whatsappUtils');
const jwt = require('jsonwebtoken');

// ── Helper: send OTP via WhatsApp AND email ─────────────────
const dispatchOTP = async (user, otp) => {
  // Always send email
  try { await sendOTPEmail(user.email, user.name, otp); } catch (e) { console.error('OTP email failed:', e.message); }
  // Also send WhatsApp if phone exists
  if (user.phone) {
    try { await sendOTPWhatsApp(user.phone, user.name, otp); } catch (e) { console.error('OTP WhatsApp failed:', e.message); }
  }
};

// ── Register ─────────────────────────────────────────────────
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Phone is required if WhatsApp OTP desired
    const existing = await User.findOne({ email });
    if (existing) {
      if (!existing.isVerified) {
        const otp = existing.generateOTP();
        await existing.save({ validateBeforeSave: false });
        await dispatchOTP(existing, otp);
        return res.status(200).json({
          success: true,
          message: phone
            ? 'OTP resent to your email and WhatsApp.'
            : 'OTP resent to your email.',
          userId: existing._id,
        });
      }
      return res.status(400).json({ success: false, message: 'Email already registered. Please login.' });
    }

    const user = await User.create({ name, email, password, phone });
    const otp  = user.generateOTP();
    await user.save({ validateBeforeSave: false });
    await dispatchOTP(user, otp);

    const channel = user.phone ? 'email and WhatsApp' : 'email';
    res.status(201).json({
      success: true,
      message: `Registration successful. OTP sent to your ${channel}.`,
      userId: user._id,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Verify OTP ───────────────────────────────────────────────
exports.verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    const user = await User.findById(userId).select('+otp +otpExpiry');

    if (!user)              return res.status(404).json({ success: false, message: 'User not found' });
    if (user.otp !== otp)  return res.status(400).json({ success: false, message: 'Invalid OTP' });
    if (new Date() > user.otpExpiry) return res.status(400).json({ success: false, message: 'OTP expired. Request a new one.' });

    user.isVerified  = true;
    user.otp         = undefined;
    user.otpExpiry   = undefined;
    await user.save({ validateBeforeSave: false });

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Login ────────────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Please provide email and password' });

    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ success: false, message: 'Invalid email or password' });

    if (!user.googleId && !(await user.comparePassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid email or password' });

    if (!user.isVerified) {
      const otp = user.generateOTP();
      await user.save({ validateBeforeSave: false });
      await dispatchOTP(user, otp);
      return res.status(403).json({
        success: false,
        message: 'Email not verified. OTP sent.',
        userId: user._id,
        requiresVerification: true,
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Google OAuth callback ─────────────────────────────────────
// FIX: Must REDIRECT to frontend — not return JSON.
// The browser follows the OAuth redirect; returning JSON breaks the flow.
exports.googleCallback = async (req, res) => {
  try {
    const user         = req.user;
    const accessToken  = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // sameSite MUST be 'lax' for OAuth cross-site redirects (not 'strict')
    const cookieBase = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',  // ← KEY FIX: 'strict' breaks cross-site OAuth
    };

    res.cookie('refreshToken', refreshToken, { ...cookieBase, maxAge: 30 * 24 * 60 * 60 * 1000 });
    res.cookie('accessToken',  accessToken,  { ...cookieBase, maxAge:  7 * 24 * 60 * 60 * 1000 });

    // Redirect frontend to a handler page with the token in URL
    // The frontend page reads the token and calls /api/auth/me
    res.redirect(`${process.env.CLIENT_URL}/auth/google/success?token=${accessToken}`);
  } catch (error) {
    console.error('Google callback error:', error);
    res.redirect(`${process.env.CLIENT_URL}/login?error=google_auth_failed`);
  }
};

// ── Forgot Password ───────────────────────────────────────────
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res.status(200).json({ success: true, message: 'If this email exists, a reset link has been sent.' });

    const resetToken = user.generateResetToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // Send email
    try { await sendPasswordResetEmail(email, user.name, resetUrl); } catch (e) { console.error('Reset email failed:', e.message); }

    // Also send WhatsApp OTP if phone exists
    if (user.phone) {
      const otp = user.generateOTP();
      await user.save({ validateBeforeSave: false });
      try { await sendPasswordResetWhatsApp(user.phone, user.name, otp); } catch (e) { console.error('Reset WA failed:', e.message); }
    }

    res.status(200).json({ success: true, message: 'Password reset link sent to your email.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Reset Password ────────────────────────────────────────────
exports.resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpiry: { $gt: Date.now() },
    }).select('+resetPasswordToken +resetPasswordExpiry');

    if (!user)
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });

    user.password            = req.body.password;
    user.resetPasswordToken  = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successful. Please login.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Refresh Token ─────────────────────────────────────────────
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken)
      return res.status(401).json({ success: false, message: 'No refresh token' });

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user    = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ success: false, message: 'User not found' });

    const accessToken = generateAccessToken(user._id);
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ success: true, accessToken });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid refresh token' });
  }
};

// ── Logout ────────────────────────────────────────────────────
exports.logout = (req, res) => {
  res.cookie('accessToken',  '', { expires: new Date(0), httpOnly: true });
  res.cookie('refreshToken', '', { expires: new Date(0), httpOnly: true });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

// ── Get Me ────────────────────────────────────────────────────
exports.getMe = async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('wishlist', 'name images price discountPrice');
  res.status(200).json({ success: true, user });
};
