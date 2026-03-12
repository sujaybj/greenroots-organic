import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer style={{ background: '#1B4332', color: 'rgba(255,255,255,0.85)', paddingTop: 'clamp(32px,6vw,48px)' }}>
    <div className="container">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 'clamp(24px,4vw,40px)', paddingBottom: 'clamp(28px,5vw,40px)' }}>

        {/* Brand */}
        <div style={{ gridColumn: 'span 1' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <span style={{ fontSize: '1.6rem' }}>🌿</span>
            <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.2rem', fontWeight: 700, color: 'white' }}>GreenRoots</span>
          </div>
          <p style={{ fontSize: 'clamp(0.82rem,2vw,0.9rem)', lineHeight: 1.8, color: 'rgba(255,255,255,0.65)', maxWidth: '240px' }}>
            Bringing pure, certified organic products from trusted farms directly to your doorstep.
          </p>
          <div style={{ display: 'flex', gap: '10px', marginTop: '14px', flexWrap: 'wrap' }}>
            {['📘','📸','🐦','▶️'].map((icon,i) => (
              <button key={i} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', padding: '8px', fontSize: '1rem', cursor: 'pointer', minWidth: '38px', minHeight: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
                onMouseOver={e => e.currentTarget.style.background='rgba(255,255,255,0.2)'}
                onMouseOut={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'}>
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ color: 'white', marginBottom: '14px', fontSize: '0.95rem', fontFamily: 'Inter, sans-serif' }}>Quick Links</h4>
          {[['/', 'Home'], ['/products', 'Shop Now'], ['/about', 'About Us'], ['/contact', 'Contact']].map(([path, label]) => (
            <Link key={path} to={path}
              style={{ display: 'block', color: 'rgba(255,255,255,0.65)', fontSize: 'clamp(0.82rem,2vw,0.9rem)', marginBottom: '10px', transition: 'color 0.2s', minHeight: '28px' }}
              onMouseOver={e => e.target.style.color='#74C69D'}
              onMouseOut={e => e.target.style.color='rgba(255,255,255,0.65)'}>
              {label}
            </Link>
          ))}
        </div>

        {/* Categories */}
        <div>
          <h4 style={{ color: 'white', marginBottom: '14px', fontSize: '0.95rem', fontFamily: 'Inter, sans-serif' }}>Categories</h4>
          {['Vegetables','Fruits','Dairy','Grains','Spices','Skincare'].map(cat => (
            <Link key={cat} to={`/products?category=${cat}`}
              style={{ display: 'block', color: 'rgba(255,255,255,0.65)', fontSize: 'clamp(0.82rem,2vw,0.9rem)', marginBottom: '10px', transition: 'color 0.2s', minHeight: '28px' }}
              onMouseOver={e => e.target.style.color='#74C69D'}
              onMouseOut={e => e.target.style.color='rgba(255,255,255,0.65)'}>
              {cat}
            </Link>
          ))}
        </div>

        {/* Contact */}
        <div>
          <h4 style={{ color: 'white', marginBottom: '14px', fontSize: '0.95rem', fontFamily: 'Inter, sans-serif' }}>Contact Us</h4>
          {[['📧','sujaybjsujay943@gmail.com'],['📞','+91 7899998321'],['📍','Bangalore, Karnataka, India']].map(([icon,text]) => (
            <div key={text} style={{ display: 'flex', gap: '8px', marginBottom: '12px', fontSize: 'clamp(0.8rem,2vw,0.88rem)', color: 'rgba(255,255,255,0.65)', alignItems: 'flex-start' }}>
              <span style={{ flexShrink: 0 }}>{icon}</span><span>{text}</span>
            </div>
          ))}
          <div style={{ marginTop: '16px' }}>
            <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', marginBottom: '8px' }}>Certified by</p>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {['FSSAI','India Organic','Non-GMO'].map(cert => (
                <span key={cert} style={{ background: 'rgba(116,198,157,0.15)', border: '1px solid rgba(116,198,157,0.3)', borderRadius: '4px', padding: '3px 8px', fontSize: '0.72rem', color: '#74C69D' }}>{cert}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Bottom bar */}
    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: 'clamp(14px,3vw,20px) 0' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <p style={{ fontSize: 'clamp(0.75rem,1.8vw,0.85rem)', color: 'rgba(255,255,255,0.45)' }}>© 2025 GreenRoots Organics. All rights reserved.</p>
        <div style={{ display: 'flex', gap: 'clamp(10px,3vw,16px)', flexWrap: 'wrap' }}>
          {[['#','Privacy Policy'],['#','Terms of Service'],['#','Return Policy']].map(([href,label]) => (
            <a key={label} href={href} style={{ fontSize: 'clamp(0.72rem,1.8vw,0.8rem)', color: 'rgba(255,255,255,0.45)', transition: 'color 0.2s' }}
              onMouseOver={e => e.target.style.color='rgba(255,255,255,0.8)'}
              onMouseOut={e => e.target.style.color='rgba(255,255,255,0.45)'}>{label}</a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
