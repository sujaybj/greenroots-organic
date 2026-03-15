import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Contact = () => {
  const [form, setForm]       = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { toast.error('Please fill all required fields'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setSent(true);
    setLoading(false);
    toast.success("Message sent! We'll get back to you soon 🌿");
  };

  const contactCards = [
    {
      icon: '📧',
      title: 'Email Us',
      line1: 'sujaybj8@gmail.com',
      line2: 'We reply within 24 hours',
      href: 'mailto:sujaybj8@gmail.com',
      color: '#D1FAE5',
      iconColor: '#2D6A4F',
    },
    {
      icon: '📞',
      title: 'Call Us',
      line1: '+91 78999 98321',
      line2: 'Mon–Sat, 9 AM – 6 PM IST',
      href: 'tel:+917899998321',
      color: '#DBEAFE',
      iconColor: '#1D4ED8',
    },
    {
      icon: '📍',
      title: 'Visit Us',
      line1: 'J P Nagar, Bangalore',
      line2: 'Karnataka – 560078, India',
      href: 'https://maps.google.com/?q=JP+Nagar,+Bangalore',
      color: '#FEF3C7',
      iconColor: '#D97706',
    },
    {
      icon: '🕒',
      title: 'Working Hours',
      line1: 'Mon–Sat: 9 AM – 6 PM',
      line2: 'Sunday: 10 AM – 2 PM',
      href: null,
      color: '#F3E8FF',
      iconColor: '#7C3AED',
    },
  ];

  const socialLinks = [
    {
      platform: 'Instagram',
      handle: '@sujay_achrya_18',
      href: 'https://instagram.com/sujay_achrya_18',
      bg: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="white">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
        </svg>
      ),
    },
    {
      platform: 'Facebook',
      handle: 'Sujay Acharya Sujay',
      href: 'https://facebook.com/SujayAcharyaSujay',
      bg: '#1877F2',
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="white">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
    },
    {
      platform: 'Twitter / X',
      handle: '@Sujay',
      href: 'https://x.com/sujaybj8',
      bg: '#000000',
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="white">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
    },
    {
      platform: 'YouTube',
      handle: 'Wild Diaries',
      href: 'https://youtube.com/@SrujanAcharBalige',
      bg: '#FF0000',
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="white">
          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
    },
  ];

  return (
    <>
      <Helmet><title>Contact Us - GreenRoots Organics</title></Helmet>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #1B4332, #2D6A4F)', padding: '60px 20px', textAlign: 'center', color: 'white' }}>
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)' }}>Get in Touch</h1>
          <p style={{ opacity: 0.85, marginTop: '12px', fontSize: '1rem' }}>We'd love to hear from you. Our team is always here to help.</p>
        </motion.div>
      </section>

      <div className="container" style={{ paddingTop: '56px', paddingBottom: '64px' }}>

        {/* ── Contact Cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '56px' }}>
          {contactCards.map((card, i) => (
            <motion.div key={card.title} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}>
              {card.href ? (
                <a href={card.href} target={card.href.startsWith('http') ? '_blank' : '_self'}
                  rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
                  <ContactCard card={card} />
                </a>
              ) : (
                <ContactCard card={card} />
              )}
            </motion.div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>

          {/* ── Social Media ── */}
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Connect With Us</h2>
            <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: '24px' }}>Follow us for organic tips, farm stories and exclusive offers</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {socialLinks.map(({ platform, handle, href, bg, icon }) => (
                <a key={platform} href={href} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '14px 18px', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6', textDecoration: 'none', transition: 'transform 0.2s, box-shadow 0.2s' }}
                  onMouseOver={e => { e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'; }}
                  onMouseOut={e => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'; }}>
                  <div style={{ background: bg, borderRadius: '10px', width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {icon}
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1B1B1B', margin: 0 }}>{platform}</p>
                    <p style={{ fontSize: '0.82rem', color: '#6B7280', margin: '2px 0 0' }}>{handle}</p>
                  </div>
                  <span style={{ marginLeft: 'auto', color: '#9CA3AF', fontSize: '1rem' }}>→</span>
                </a>
              ))}
            </div>

            {/* Map */}
            <div style={{ marginTop: '28px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #E5E7EB' }}>
              <iframe
                title="GreenRoots Location"
                src="https://maps.google.com/maps?q=JP+Nagar,+Bangalore&output=embed&z=14"
                width="100%" height="200" style={{ border: 0, display: 'block' }}
                loading="lazy"
              />
            </div>
          </div>

          {/* ── Contact Form ── */}
          <div style={{ background: 'white', borderRadius: '20px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid #F3F4F6' }}>
            {!sent ? (
              <>
                <h2 style={{ fontSize: '1.4rem', marginBottom: '6px' }}>Send a Message</h2>
                <p style={{ color: '#9CA3AF', fontSize: '0.85rem', marginBottom: '24px' }}>We'll respond within 24 hours</p>
                <form onSubmit={handleSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div className="form-group">
                      <label className="form-label">Name *</label>
                      <input className="form-input" placeholder="Your name" value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email *</label>
                      <input type="email" className="form-input" placeholder="you@email.com" value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input type="tel" className="form-input" placeholder="+91 XXXXX XXXXX" value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Subject</label>
                    <select className="form-input" value={form.subject}
                      onChange={e => setForm({ ...form, subject: e.target.value })}>
                      <option value="">Select subject</option>
                      <option value="order">Order Issue</option>
                      <option value="product">Product Inquiry</option>
                      <option value="return">Return / Refund</option>
                      <option value="wholesale">Wholesale Inquiry</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Message *</label>
                    <textarea className="form-input" rows={4} placeholder="How can we help you?"
                      value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                      style={{ resize: 'vertical' }} />
                  </div>
                  <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
                    {loading ? '⏳ Sending...' : 'Send Message →'}
                  </button>
                </form>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: '56px', marginBottom: '16px' }}>✅</div>
                <h3 style={{ fontSize: '1.4rem', color: '#2D6A4F' }}>Message Sent!</h3>
                <p style={{ color: '#6B7280', marginTop: '8px', fontSize: '0.9rem' }}>
                  Thank you! We'll reply to <strong>{form.email}</strong> within 24 hours.
                </p>
                <button onClick={() => setSent(false)} className="btn btn-outline" style={{ marginTop: '20px' }}>
                  Send Another
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// Small helper component
const ContactCard = ({ card }) => (
  <div style={{ padding: '20px', background: card.color, borderRadius: '14px', height: '100%', transition: 'transform 0.2s' }}
    onMouseOver={e => e.currentTarget.style.transform = 'translateY(-3px)'}
    onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
    <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{card.icon}</div>
    <h4 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.88rem', color: card.iconColor, marginBottom: '6px' }}>{card.title}</h4>
    <p style={{ fontSize: '0.9rem', color: '#1B1B1B', fontWeight: 600, margin: 0 }}>{card.line1}</p>
    <p style={{ fontSize: '0.78rem', color: '#6B7280', margin: '4px 0 0' }}>{card.line2}</p>
  </div>
);

export default Contact;
