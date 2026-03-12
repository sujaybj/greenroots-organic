import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import API from '../utils/api';
import toast from 'react-hot-toast';

const Contact = () => {
  const [form, setForm] = useState({ name:'', email:'', phone:'', subject:'', message:'' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { toast.error('Please fill all required fields'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setSent(true);
    setLoading(false);
    toast.success("Message sent! We'll get back to you soon 🌿");
  };

  return (
    <>
      <Helmet><title>Contact Us - GreenRoots Organics</title></Helmet>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg,#1B4332,#2D6A4F)', padding: 'clamp(40px,8vw,60px) 20px', textAlign: 'center', color: 'white' }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.8rem,5vw,2.8rem)' }}>Get in Touch</h1>
        <p style={{ opacity: 0.85, marginTop: '12px', fontSize: 'clamp(0.88rem,2vw,1.05rem)' }}>We'd love to hear from you. Our team is always here to help.</p>
      </section>

      <div className="container" style={{ paddingTop: 'clamp(36px,6vw,64px)', paddingBottom: 'clamp(36px,6vw,64px)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 'clamp(24px,5vw,48px)' }}>

          {/* Contact Info */}
          <div>
            <h2 style={{ fontSize: 'clamp(1.3rem,3vw,1.6rem)', marginBottom: '20px' }}>Contact Information</h2>
            {[
              {icon:'📧',title:'Email',info:'sujaybjsujay943@gmail.com',sub:'We reply within 24 hours'},
              {icon:'📞',title:'Phone',info:'+91 7899998321',sub:'Mon–Sat, 9 AM – 8PM IST'},
              {icon:'📍',title:'Address',info:'GreenRoots Organics Pvt. Ltd.',sub:'14th Main, J P NAGAR, Bangalore – 560078'},
              {icon:'🕒',title:'Support Hours',info:'Mon–Sat: 9 AM – 6 PM',sub:'Sunday: 10 AM – 2 PM'},
            ].map(item => (
              <div key={item.title} style={{ display: 'flex', gap: '14px', marginBottom: '16px', padding: 'clamp(12px,3vw,16px)', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', transition: 'transform 0.2s' }}
                onMouseOver={e => e.currentTarget.style.transform='translateX(4px)'}
                onMouseOut={e => e.currentTarget.style.transform='none'}>
                <span style={{ fontSize: 'clamp(1.4rem,3vw,1.8rem)', flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <h4 style={{ fontFamily: 'Inter,sans-serif', fontWeight: 700, fontSize: '0.92rem', color: '#2D6A4F' }}>{item.title}</h4>
                  <p style={{ fontSize: 'clamp(0.85rem,2vw,0.95rem)', color: '#374151', marginTop: '2px' }}>{item.info}</p>
                  <p style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>{item.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div style={{ background: 'white', borderRadius: '20px', padding: 'clamp(20px,4vw,32px)', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            {!sent ? (
              <>
                <h2 style={{ fontSize: 'clamp(1.2rem,3vw,1.4rem)', marginBottom: '20px' }}>Send us a Message</h2>
                <form onSubmit={handleSubmit}>
                  <div className="grid-2col">
                    <div className="form-group">
                      <label className="form-label">Your Name *</label>
                      <input className="form-input" placeholder="John Doe" value={form.name} onChange={e => setForm({...form,name:e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email *</label>
                      <input type="email" className="form-input" placeholder="you@email.com" value={form.email} onChange={e => setForm({...form,email:e.target.value})} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Subject</label>
                    <select className="form-input" value={form.subject} onChange={e => setForm({...form,subject:e.target.value})}>
                      <option value="">Select subject</option>
                      <option value="order">Order Issue</option>
                      <option value="product">Product Inquiry</option>
                      <option value="return">Return/Refund</option>
                      <option value="wholesale">Wholesale Inquiry</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Message *</label>
                    <textarea className="form-input" rows={5} placeholder="How can we help you?" value={form.message}
                      onChange={e => setForm({...form,message:e.target.value})}
                      style={{ resize: 'vertical', minHeight: '120px' }} />
                  </div>
                  <button type="submit" disabled={loading} className="btn btn-primary btn-full btn-lg">
                    {loading ? '⏳ Sending...' : '📤 Send Message'}
                  </button>
                </form>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: 'clamp(28px,5vw,48px) 20px' }}>
                <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🎉</div>
                <h3 style={{ fontSize: '1.4rem', color: '#2D6A4F', marginBottom: '10px' }}>Message Sent!</h3>
                <p style={{ color: '#6B7280', lineHeight: 1.8, fontSize: 'clamp(0.85rem,2vw,0.95rem)' }}>
                  Thank you for reaching out. We'll get back to you within 24 hours.
                </p>
                <button onClick={() => setSent(false)} className="btn btn-outline" style={{ marginTop: '20px' }}>Send Another</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
