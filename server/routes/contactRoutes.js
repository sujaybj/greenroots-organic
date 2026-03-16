// server/routes/contactRoutes.js
const express   = require('express');
const router    = express.Router();
const nodemailer = require('nodemailer');

// ── Create transporter inline (avoids import order issues) ────
const getTransporter = () => nodemailer.createTransport({
  host:   process.env.EMAIL_HOST   || 'smtp.gmail.com',
  port:   parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // ── KEY FIX: set timeouts so it doesn't hang ──────────────
  connectionTimeout: 10000,  // 10 seconds
  greetingTimeout:   10000,
  socketTimeout:     15000,
});

// @route  POST /api/contact
// @access Public
router.post('/', async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Name, email and message are required.' });
  }

  // ── Respond immediately to avoid frontend timeout ──────────
  // We send the response first, then send the email in background
  res.status(200).json({ success: true, message: 'Message received! We\'ll reply within 24 hours.' });

  // ── Send emails in background ──────────────────────────────
  const transporter = getTransporter();
  const subjectLine = subject
    ? `[GreenRoots] ${subject} — from ${name}`
    : `[GreenRoots] New message from ${name}`;

  // Email to admin
  const adminHtml = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:580px;margin:0 auto;background:#f8fff4;padding:16px;">
      <div style="background:#2D6A4F;padding:18px 24px;border-radius:10px 10px 0 0;">
        <h2 style="color:white;margin:0;font-size:1.1rem;">New Contact Form Message</h2>
      </div>
      <div style="background:white;padding:24px;border-radius:0 0 10px 10px;border:1px solid #E5E7EB;">
        <table style="width:100%;border-collapse:collapse;font-size:0.9rem;">
          <tr><td style="padding:8px 0;color:#6B7280;font-weight:600;width:100px;">Name</td><td style="color:#1B1B1B;font-weight:700;">${name}</td></tr>
          <tr><td style="padding:8px 0;color:#6B7280;font-weight:600;">Email</td><td><a href="mailto:${email}" style="color:#2D6A4F;">${email}</a></td></tr>
          <tr><td style="padding:8px 0;color:#6B7280;font-weight:600;">Phone</td><td>${phone || '—'}</td></tr>
          <tr><td style="padding:8px 0;color:#6B7280;font-weight:600;">Subject</td><td>${subject || '—'}</td></tr>
        </table>
        <div style="margin-top:16px;background:#F8FFF4;border-left:4px solid #2D6A4F;padding:14px 16px;border-radius:0 8px 8px 0;">
          <p style="color:#6B7280;font-size:0.75rem;font-weight:700;margin:0 0 6px;text-transform:uppercase;">Message</p>
          <p style="color:#1B1B1B;line-height:1.7;margin:0;">${message.replace(/\n/g, '<br/>')}</p>
        </div>
        <p style="margin-top:16px;padding:10px;background:#FEF3C7;border-radius:6px;font-size:0.8rem;color:#92400E;">
          Reply directly to this email to respond to ${name} at ${email}
        </p>
      </div>
    </div>`;

  // Auto-reply to user
  const userHtml = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:580px;margin:0 auto;background:#f8fff4;padding:16px;">
      <div style="background:#2D6A4F;padding:18px 24px;border-radius:10px 10px 0 0;">
        <h2 style="color:white;margin:0;font-size:1.1rem;">GreenRoots Organics</h2>
        <p style="color:rgba(255,255,255,0.7);margin:4px 0 0;font-size:0.82rem;">Pure · Natural · Organic</p>
      </div>
      <div style="background:white;padding:28px;border-radius:0 0 10px 10px;border:1px solid #E5E7EB;">
        <h3 style="color:#2D6A4F;margin:0 0 12px;">Thanks for reaching out, ${name}!</h3>
        <p style="color:#4B5563;line-height:1.8;">We've received your message and will reply within <strong>24 hours</strong>.</p>
        <div style="background:#F8FFF4;border:1px solid #D1FAE5;border-radius:8px;padding:14px;margin:16px 0;">
          <p style="color:#6B7280;font-size:0.75rem;font-weight:700;margin:0 0 6px;text-transform:uppercase;">Your message</p>
          <p style="color:#1B1B1B;line-height:1.7;margin:0;font-size:0.9rem;">${message.replace(/\n/g, '<br/>')}</p>
        </div>
        <p style="color:#4B5563;margin-top:16px;">
          — <strong style="color:#2D6A4F;">Team GreenRoots Organics</strong><br/>
          <span style="font-size:0.82rem;color:#9CA3AF;">J P Nagar, Bangalore · sujaybj8@gmail.com</span>
        </p>
      </div>
    </div>`;

  try {
    await transporter.sendMail({
      from:    process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to:      process.env.CONTACT_EMAIL || process.env.EMAIL_USER,
      replyTo: email,
      subject: subjectLine,
      html:    adminHtml,
    });
    await transporter.sendMail({
      from:    process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to:      email,
      subject: 'We received your message — GreenRoots Organics',
      html:    userHtml,
    });
    console.log(`✅ Contact form email sent from ${email}`);
  } catch (err) {
    console.error('Contact email error:', err.message);
    // Already responded 200 — user sees success, email fails silently
  }
});

module.exports = router;
