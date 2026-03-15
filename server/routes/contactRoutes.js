// server/routes/contactRoutes.js
const express = require('express');
const router  = express.Router();
const { sendEmail } = require('../utils/tokenUtils');

// @route  POST /api/contact
// @desc   Send contact form message to admin email
// @access Public
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email and message are required.' });
    }

    const subjectLine = subject
      ? `[GreenRoots Contact] ${subject} — from ${name}`
      : `[GreenRoots Contact] New message from ${name}`;

    // ── Email to YOU (admin) ──────────────────────────────
    const adminHtml = `
      <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;background:#f8fff4;padding:20px;">
        <div style="background:#2D6A4F;padding:20px 28px;border-radius:10px 10px 0 0;">
          <h2 style="color:white;margin:0;font-size:1.2rem;">📬 New Contact Form Message</h2>
          <p style="color:rgba(255,255,255,0.75);margin:4px 0 0;font-size:0.85rem;">GreenRoots Organics — Contact Form</p>
        </div>
        <div style="background:white;padding:28px;border-radius:0 0 10px 10px;border:1px solid #E5E7EB;border-top:none;">
          <table style="width:100%;border-collapse:collapse;font-size:0.93rem;">
            <tr style="border-bottom:1px solid #F3F4F6;">
              <td style="padding:10px 0;color:#6B7280;font-weight:600;width:120px;">Name</td>
              <td style="padding:10px 0;color:#1B1B1B;font-weight:600;">${name}</td>
            </tr>
            <tr style="border-bottom:1px solid #F3F4F6;">
              <td style="padding:10px 0;color:#6B7280;font-weight:600;">Email</td>
              <td style="padding:10px 0;"><a href="mailto:${email}" style="color:#2D6A4F;">${email}</a></td>
            </tr>
            <tr style="border-bottom:1px solid #F3F4F6;">
              <td style="padding:10px 0;color:#6B7280;font-weight:600;">Phone</td>
              <td style="padding:10px 0;color:#1B1B1B;">${phone || '—'}</td>
            </tr>
            <tr style="border-bottom:1px solid #F3F4F6;">
              <td style="padding:10px 0;color:#6B7280;font-weight:600;">Subject</td>
              <td style="padding:10px 0;color:#1B1B1B;">${subject || '—'}</td>
            </tr>
          </table>
          <div style="margin-top:20px;background:#F8FFF4;border-left:4px solid #2D6A4F;padding:16px 20px;border-radius:0 8px 8px 0;">
            <p style="color:#6B7280;font-size:0.8rem;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 8px;">Message</p>
            <p style="color:#1B1B1B;line-height:1.8;margin:0;font-size:0.95rem;">${message.replace(/\n/g, '<br/>')}</p>
          </div>
          <div style="margin-top:20px;padding:14px;background:#FEF3C7;border-radius:8px;font-size:0.82rem;color:#92400E;">
            <strong>Reply directly</strong> to this email to respond to ${name} at ${email}
          </div>
        </div>
        <p style="text-align:center;color:#9CA3AF;font-size:0.75rem;margin-top:16px;">
          GreenRoots Organics • Sent from contact form
        </p>
      </div>`;

    await sendEmail({
      to: process.env.CONTACT_EMAIL || process.env.EMAIL_USER,
      subject: subjectLine,
      html: adminHtml,
    });

    // ── Auto-reply to the user ────────────────────────────
    const userHtml = `
      <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;background:#f8fff4;padding:20px;">
        <div style="background:#2D6A4F;padding:20px 28px;border-radius:10px 10px 0 0;">
          <h2 style="color:white;margin:0;font-size:1.2rem;">GreenRoots Organics</h2>
          <p style="color:rgba(255,255,255,0.7);margin:4px 0 0;font-size:0.85rem;">Pure · Natural · Organic</p>
        </div>
        <div style="background:white;padding:32px;border-radius:0 0 10px 10px;border:1px solid #E5E7EB;border-top:none;">
          <h3 style="color:#2D6A4F;margin:0 0 12px;">Thanks for reaching out, ${name}!</h3>
          <p style="color:#4B5563;line-height:1.8;margin-bottom:16px;">
            We've received your message and will get back to you within <strong>24 hours</strong>.
          </p>
          <div style="background:#F8FFF4;border:1px solid #D1FAE5;border-radius:10px;padding:18px 20px;margin:20px 0;">
            <p style="color:#6B7280;font-size:0.8rem;font-weight:700;text-transform:uppercase;margin:0 0 8px;">Your message</p>
            <p style="color:#1B1B1B;line-height:1.7;margin:0;font-size:0.93rem;">${message.replace(/\n/g, '<br/>')}</p>
          </div>
          <p style="color:#4B5563;line-height:1.8;margin-top:20px;">
            In the meantime, feel free to browse our <a href="${process.env.CLIENT_URL}/products" style="color:#2D6A4F;font-weight:600;">organic products</a>.
          </p>
          <p style="color:#4B5563;margin-top:16px;">
            Warm regards,<br/>
            <strong style="color:#2D6A4F;">Team GreenRoots Organics</strong>
          </p>
        </div>
        <p style="text-align:center;color:#9CA3AF;font-size:0.75rem;margin-top:16px;">
          © 2025 GreenRoots Organics · J P Nagar, Bangalore
        </p>
      </div>`;

    await sendEmail({
      to: email,
      subject: `We received your message — GreenRoots Organics`,
      html: userHtml,
    });

    res.status(200).json({ success: true, message: 'Message sent successfully!' });

  } catch (error) {
    console.error('Contact form error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to send message. Please try again.' });
  }
});

module.exports = router;
