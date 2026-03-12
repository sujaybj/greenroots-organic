const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// ─── Token Utilities ─────────────────────────────────────────
const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' });
};

const sendTokenResponse = (user, statusCode, res) => {
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);
  res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });

  const userData = {
    _id: user._id, name: user.name, email: user.email,
    role: user.role, avatar: user.avatar, phone: user.phone,
    isVerified: user.isVerified,
  };

  res.status(statusCode).json({ success: true, accessToken, user: userData });
};

// ─── Email Utility ────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  };
  await transporter.sendMail(mailOptions);
};

const sendOTPEmail = async (email, name, otp) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8fff4;">
      <div style="background: #2D6A4F; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0;">🌿 GreenRoots Organics</h1>
      </div>
      <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px;">
        <h2 style="color: #2D6A4F;">Verify Your Email</h2>
        <p>Hello <strong>${name}</strong>,</p>
        <p>Your OTP for email verification is:</p>
        <div style="background: #f0faf4; border: 2px dashed #2D6A4F; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
          <h1 style="color: #2D6A4F; letter-spacing: 8px; margin: 0; font-size: 36px;">${otp}</h1>
        </div>
        <p style="color: #666;">This OTP is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
        <p style="color: #999; font-size: 12px;">If you didn't request this, please ignore this email.</p>
      </div>
    </div>`;
  await sendEmail({ to: email, subject: 'Verify Your Email - GreenRoots Organics', html });
};

const sendPasswordResetEmail = async (email, name, resetUrl) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8fff4;">
      <div style="background: #2D6A4F; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0;">🌿 GreenRoots Organics</h1>
      </div>
      <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px;">
        <h2 style="color: #2D6A4F;">Reset Your Password</h2>
        <p>Hello <strong>${name}</strong>,</p>
        <p>Click the button below to reset your password. This link expires in <strong>30 minutes</strong>.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background: #2D6A4F; color: white; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-size: 16px;">Reset Password</a>
        </div>
        <p style="color: #999; font-size: 12px;">If you didn't request this, please ignore this email. Your password will remain unchanged.</p>
      </div>
    </div>`;
  await sendEmail({ to: email, subject: 'Password Reset Request - GreenRoots Organics', html });
};

const sendOrderConfirmationEmail = async (email, name, order) => {
  const itemsList = order.items.map(item =>
    `<tr><td>${item.name}</td><td>${item.quantity} ${item.unit || ''}</td><td>₹${item.price}</td></tr>`
  ).join('');
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8fff4;">
      <div style="background: #2D6A4F; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0;">🌿 GreenRoots Organics</h1>
      </div>
      <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px;">
        <h2 style="color: #2D6A4F;">Order Confirmed! 🎉</h2>
        <p>Hello <strong>${name}</strong>, your order has been placed successfully.</p>
        <p><strong>Order ID:</strong> #${order._id.toString().slice(-8).toUpperCase()}</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead><tr style="background: #f0faf4;"><th>Item</th><th>Qty</th><th>Price</th></tr></thead>
          <tbody>${itemsList}</tbody>
        </table>
        <p><strong>Total Amount: ₹${order.totalAmount}</strong></p>
        <p style="color: #666;">Expected delivery in 3-5 business days.</p>
      </div>
    </div>`;
  await sendEmail({ to: email, subject: `Order Confirmed #${order._id.toString().slice(-8).toUpperCase()} - GreenRoots`, html });
};

module.exports = { generateAccessToken, generateRefreshToken, sendTokenResponse, sendEmail, sendOTPEmail, sendPasswordResetEmail, sendOrderConfirmationEmail };
