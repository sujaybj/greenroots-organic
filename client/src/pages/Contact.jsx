import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  Mail, Phone, MapPin, Clock,
  Send, Instagram, Facebook, Twitter, Youtube,
  MessageCircle, CheckCircle2, User, ChevronRight,
  Loader2,
} from 'lucide-react';
import API from '../utils/api';
import toast from 'react-hot-toast';

const CONTACT_CARDS = [
  { Icon: Mail,   bg: '#ECFDF5', iconBg: '#D1FAE5', color: '#059669', title: 'Email Us',      line1: 'sujaybj8@gmail.com',   line2: 'Reply within 24 hours',     href: 'mailto:sujaybj8@gmail.com'                          },
  { Icon: Phone,  bg: '#EFF6FF', iconBg: '#DBEAFE', color: '#2563EB', title: 'Call Us',       line1: '+91 78999 98321',       line2: 'Mon–Sat, 9 AM – 6 PM IST',  href: 'tel:+917899998321'                                  },
  { Icon: MapPin, bg: '#FFFBEB', iconBg: '#FEF3C7', color: '#D97706', title: 'Visit Us',      line1: 'J P Nagar, Bangalore', line2: 'Karnataka – 560078, India',  href: 'https://maps.google.com/?q=JP+Nagar+Bangalore'      },
  { Icon: Clock,  bg: '#F5F3FF', iconBg: '#EDE9FE', color: '#7C3AED', title: 'Working Hours', line1: 'Mon–Sat: 9 AM – 6 PM', line2: 'Sunday: 10 AM – 2 PM',      href: null                                                 },
];

const SOCIALS = [
  { Icon: Instagram, label: 'Instagram', handle: '@sujay_achrya_18',   href: 'https://instagram.com/sujay_achrya_18',   bg: 'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)' },
  { Icon: Facebook,  label: 'Facebook',  handle: 'Sujay Acharya Sujay', href: 'https://facebook.com/SujayAcharyaSujay', bg: '#1877F2'  },
  { Icon: Twitter,   label: 'Twitter / X', handle: '@Sujay',            href: 'https://x.com/Sujay',                    bg: '#000000'  },
  { Icon: Youtube,   label: 'YouTube',   handle: '@SrujanAcharBalige',  href: 'https://youtube.com/@SrujanAcharBalige', bg: '#FF0000'  },
];

const Contact = () => {
  const [form, setForm]       = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill name, email and message');
      return;
    }
    setLoading(true);
    try {
      // ← Calls real backend — sends email to sujaybj8@gmail.com
      await API.post('/contact', form);
      setSent(true);
      toast.success("Message sent! Check your email for confirmation.");
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Contact Us - GreenRoots Organics</title></Helmet>

      {/* ── Hero ── */}
      <section style={{ background: 'linear-gradient(135deg,#1B4332,#2D6A4F)', padding: '72px 20px', textAlign: 'center', color: 'white', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '280px', height: '280px', borderRadius: '50%', background: 'rgba(116,198,157,0.08)' }}/>
        <div style={{ position: 'absolute', bottom: '-50px', left: '-50px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(116,198,157,0.06)' }}/>
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ background: 'rgba(116,198,157,0.2)', borderRadius: '50%', width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: '1.5px solid rgba(116,198,157,0.3)' }}>
            <MessageCircle size={28} color="#74C69D" strokeWidth={1.8}/>
          </div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.8rem,3vw,2.8rem)' }}>Get in Touch</h1>
          <p style={{ opacity: 0.8, marginTop: '12px', fontSize: '1rem', maxWidth: '480px', margin: '12px auto 0', lineHeight: 1.8 }}>
            We'd love to hear from you. Our team is always here to help.
          </p>
        </motion.div>
      </section>

      <div className="container" style={{ paddingTop: '56px', paddingBottom: '64px' }}>

        {/* ── Contact Cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '14px', marginBottom: '52px' }}>
          {CONTACT_CARDS.map(({ Icon, bg, iconBg, color, title, line1, line2, href }, i) => {
            const card = (
              <motion.div
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.08 }} whileHover={{ y: -4 }}
                style={{ background: bg, borderRadius: '16px', padding: '22px 18px', border: `1px solid ${iconBg}`, cursor: href ? 'pointer' : 'default', height: '100%' }}>
                <div style={{ background: iconBg, borderRadius: '10px', width: '46px', height: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                  <Icon size={21} color={color} strokeWidth={1.8}/>
                </div>
                <h4 style={{ fontFamily: 'Inter,sans-serif', fontWeight: 700, fontSize: '0.75rem', color, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '5px' }}>{title}</h4>
                <p style={{ fontSize: '0.9rem', color: '#1B1B1B', fontWeight: 600, margin: 0 }}>{line1}</p>
                <p style={{ fontSize: '0.76rem', color: '#6B7280', margin: '3px 0 0', lineHeight: 1.5 }}>{line2}</p>
              </motion.div>
            );
            return href
              ? <a key={title} href={href} target={href.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block' }}>{card}</a>
              : <div key={title}>{card}</div>;
          })}
        </div>

        {/* ── Main Grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '40px' }}>

          {/* ── Social + Map ── */}
          <div>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '6px' }}>Connect With Us</h2>
            <p style={{ color: '#6B7280', fontSize: '0.87rem', marginBottom: '22px' }}>Follow for organic tips, farm stories and exclusive deals</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
              {SOCIALS.map(({ Icon, label, handle, href, bg }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '13px 16px', background: 'white', borderRadius: '12px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6', textDecoration: 'none', transition: 'transform 0.2s, box-shadow 0.2s' }}
                  onMouseOver={e => { e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'; }}
                  onMouseOut={e => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.boxShadow = '0 1px 6px rgba(0,0,0,0.06)'; }}>
                  <div style={{ background: bg, borderRadius: '10px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={18} color="white" strokeWidth={1.8}/>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700, fontSize: '0.87rem', color: '#1B1B1B', margin: 0 }}>{label}</p>
                    <p style={{ fontSize: '0.77rem', color: '#6B7280', margin: '2px 0 0' }}>{handle}</p>
                  </div>
                  <ChevronRight size={15} color="#D1D5DB"/>
                </a>
              ))}
            </div>

            <div style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <iframe title="GreenRoots Location"
                src="https://maps.google.com/maps?q=JP+Nagar,+Bangalore&output=embed&z=14"
                width="100%" height="190" style={{ border: 0, display: 'block' }} loading="lazy"/>
            </div>
          </div>

          {/* ── Form ── */}
          <div style={{ background: 'white', borderRadius: '20px', padding: 'clamp(22px,4vw,34px)', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #F3F4F6' }}>
            {!sent ? (
              <>
                <h2 style={{ fontSize: '1.4rem', marginBottom: '4px' }}>Send a Message</h2>
                <p style={{ color: '#9CA3AF', fontSize: '0.82rem', marginBottom: '22px' }}>
                  Your message will be sent directly to <strong style={{ color: '#2D6A4F' }}>sujaybj8@gmail.com</strong>
                </p>

                <form onSubmit={handleSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div className="form-group">
                      <label className="form-label">Name *</label>
                      <div style={{ position: 'relative' }}>
                        <User size={14} color="#9CA3AF" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}/>
                        <input className="form-input" placeholder="Your name" value={form.name}
                          style={{ paddingLeft: '34px' }}
                          onChange={e => setForm({ ...form, name: e.target.value })}/>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email *</label>
                      <div style={{ position: 'relative' }}>
                        <Mail size={14} color="#9CA3AF" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}/>
                        <input type="email" className="form-input" placeholder="you@email.com" value={form.email}
                          style={{ paddingLeft: '34px' }}
                          onChange={e => setForm({ ...form, email: e.target.value })}/>
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={14} color="#9CA3AF" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}/>
                      <input type="tel" className="form-input" placeholder="+91 XXXXX XXXXX" value={form.phone}
                        style={{ paddingLeft: '34px' }}
                        onChange={e => setForm({ ...form, phone: e.target.value })}/>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Subject</label>
                    <select className="form-input" value={form.subject}
                      onChange={e => setForm({ ...form, subject: e.target.value })}>
                      <option value="">Select a subject</option>
                      <option value="Order Issue">Order Issue</option>
                      <option value="Product Inquiry">Product Inquiry</option>
                      <option value="Return / Refund">Return / Refund</option>
                      <option value="Wholesale Inquiry">Wholesale Inquiry</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Message *</label>
                    <textarea className="form-input" rows={4} placeholder="How can we help you?"
                      value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                      style={{ resize: 'vertical' }}/>
                  </div>
                  <button type="submit" disabled={loading}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '13px', background: '#2D6A4F', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Inter,sans-serif', transition: 'background 0.2s', opacity: loading ? 0.75 : 1 }}
                    onMouseOver={e => { if (!loading) e.currentTarget.style.background = '#1B4332'; }}
                    onMouseOut={e => e.currentTarget.style.background = '#2D6A4F'}>
                    {loading
                      ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }}/> Sending...</>
                      : <><Send size={16} strokeWidth={2}/> Send Message</>
                    }
                  </button>
                </form>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '48px 0' }}>
                <div style={{ background: '#D1FAE5', borderRadius: '50%', width: '72px', height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <CheckCircle2 size={36} color="#059669" strokeWidth={1.8}/>
                </div>
                <h3 style={{ fontSize: '1.4rem', color: '#2D6A4F', marginBottom: '8px' }}>Message Sent!</h3>
                <p style={{ color: '#6B7280', fontSize: '0.88rem', lineHeight: 1.7 }}>
                  Your message was delivered to <strong>sujaybj8@gmail.com</strong>.<br/>
                  A confirmation was also sent to <strong>{form.email}</strong>.
                </p>
                <button onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }}
                  style={{ marginTop: '20px', padding: '10px 24px', background: 'none', border: '1.5px solid #2D6A4F', borderRadius: '8px', color: '#2D6A4F', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>
                  Send Another
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
};

export default Contact;
