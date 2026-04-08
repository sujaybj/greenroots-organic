const crypto = require('crypto');
const User   = require('../models/User');
const { generateAccessToken, generateRefreshToken, sendEmail, sendOTPEmail, sendPasswordResetEmail } = require('../utils/tokenUtils');

const buildCookieOptions = () => {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
  };
};

// ── Helper: set cookie + send JSON ───────────────────────────
const sendTokenResponse = (user, statusCode, res) => {
  const accessToken  = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // ── Cookie settings — MUST allow cross-domain (Render → Vercel) ──
  const cookieOptions = {
    ...buildCookieOptions(),
    maxAge: 30 * 24 * 60 * 60 * 1000,
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);
  res.cookie('accessToken',  accessToken,  { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });

  res.status(statusCode).json({
    success:     true,
    accessToken,
    user: {
      _id:       user._id,
      name:      user.name,
      email:     user.email,
      role:      user.role,
      avatar:    user.avatar,
      phone:     user.phone,
      isVerified:user.isVerified,
      addresses: user.addresses,
    },
  });
};

// @desc    Register
exports.register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: 'Email already registered' });

    const otp     = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExp  = new Date(Date.now() + 10 * 60 * 1000);
    const user    = await User.create({ name, email, phone, password, otp, otpExpiry: otpExp });

    await sendOTPEmail(email, name, otp);
    res.status(201).json({ success: true, message: 'OTP sent to your email', email });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user)                         return res.status(404).json({ success: false, message: 'User not found' });
    if (user.otp !== otp)              return res.status(400).json({ success: false, message: 'Invalid OTP' });
    if (user.otpExpiry < new Date())   return res.status(400).json({ success: false, message: 'OTP expired' });

    user.isVerified = true;
    user.otp        = undefined;
    user.otpExpiry  = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ success: false, message: 'Invalid email or password' });

    if (user.googleId && !user.password)
      return res.status(400).json({ success: false, message: 'Please login with Google' });

    if (!(await user.comparePassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid email or password' });

    if (!user.isVerified)
      return res.status(403).json({ success: false, message: 'Please verify your email first' });

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Google OAuth Callback
// ── FIX: redirect to frontend with token in URL (not JSON) ───
// Because Google redirects the browser, we can't send JSON.
// We redirect to /auth/google/success?token=xxx on the frontend.
exports.googleCallback = async (req, res) => {
  try {
    const user         = req.user;
    const accessToken  = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    const cookieOptions = {
      ...buildCookieOptions(),
      maxAge:   30 * 24 * 60 * 60 * 1000,
    };
    res.cookie('refreshToken', refreshToken, cookieOptions);

    // Redirect to a dedicated success page so the frontend can complete auth robustly.
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    res.redirect(`${clientUrl}/auth/google/success?token=${accessToken}`);
  } catch (error) {
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    res.redirect(`${clientUrl}/auth/google/success?error=google_auth_failed`);
  }
};

// @desc    Forgot password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(200).json({ success: true, message: 'If this email exists, a reset link has been sent.' });

    const resetToken = user.generateResetToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await sendPasswordResetEmail(email, user.name, resetUrl);
    res.status(200).json({ success: true, message: 'Password reset link sent to your email.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reset password
exports.resetPassword = async (req, res) => {
  try {
    const resetTokenHash = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken:   resetTokenHash,
      resetPasswordExpiry: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });

    user.password            = req.body.password;
    user.resetPasswordToken  = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Refresh token
exports.refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ success: false, message: 'No refresh token' });

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const user    = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ success: false, message: 'User not found' });

    const accessToken = generateAccessToken(user._id);
    res.status(200).json({ success: true, accessToken });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid refresh token', code: 'TOKEN_EXPIRED' });
  }
};

// @desc    Logout
exports.logout = async (req, res) => {
  const cookieOptions = buildCookieOptions();
  res.clearCookie('refreshToken', cookieOptions);
  res.clearCookie('accessToken', cookieOptions);
  res.status(200).json({ success: true, message: 'Logged out' });
};

// @desc    Get current user
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist', 'name images price discountPrice rating');
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
