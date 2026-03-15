import React from 'react';
import { Link } from 'react-router-dom';
import { FaLeaf, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

// ── Real Social Icons with brand colors ──────────────────────
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="white">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="white">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="white">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="white">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const SOCIALS = [
  {
    label: 'Instagram',
    href: 'https://instagram.com/sujay_achrya_18',
    Icon: InstagramIcon,
    bg: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
  },
  {
    label: 'Facebook',
    href: 'https://facebook.com/SujayAcharyaSujay',
    Icon: FacebookIcon,
    bg: '#1877F2',
  },
  {
    label: 'Twitter / X',
    href: 'https://x.com/Sujay',
    Icon: TwitterIcon,
    bg: '#000000',
  },
  {
    label: 'YouTube',
    href: 'https://youtube.com/@SrujanAcharBalige',
    Icon: YoutubeIcon,
    bg: '#FF0000',
  },
];

const Footer = () => (
  <footer style={{ background: '#1B4332', color: 'rgba(255,255,255,0.85)', paddingTop: '48px' }}>
    <div className="container">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px', paddingBottom: '40px' }}>

        {/* ── Brand ── */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <FaLeaf style={{ color: '#74C69D', fontSize: '1.4rem' }} />
            <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', fontWeight: 700, color: 'white' }}>GreenRoots</span>
          </div>
          <p style={{ fontSize: '0.88rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.65)', marginBottom: '20px' }}>
            Bringing pure, certified organic products from trusted farms directly to your doorstep.
          </p>

          {/* Social Links */}
          <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Follow Us</p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {SOCIALS.map(({ label, href, Icon, bg }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                aria-label={label} title={label}
                style={{
                  background: bg, borderRadius: '9px', padding: '9px 10px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'transform 0.2s, opacity 0.2s', cursor: 'pointer',
                  textDecoration: 'none',
                }}
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.opacity = '0.9'; }}
                onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.opacity = '1'; }}>
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {/* ── Quick Links ── */}
        <div>
          <h4 style={{ color: 'white', marginBottom: '16px', fontSize: '0.95rem', fontFamily: 'Inter, sans-serif', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Quick Links</h4>
          {[['/', 'Home'], ['/products', 'Shop Now'], ['/about', 'About Us'], ['/contact', 'Contact']].map(([path, label]) => (
            <Link key={path} to={path}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.65)', fontSize: '0.88rem', marginBottom: '10px', transition: 'color 0.2s' }}
              onMouseOver={e => e.currentTarget.style.color = '#74C69D'}
              onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.65)'}>
              <span style={{ color: '#74C69D', fontSize: '0.6rem' }}>▶</span> {label}
            </Link>
          ))}
        </div>

        {/* ── Categories ── */}
        <div>
          <h4 style={{ color: 'white', marginBottom: '16px', fontSize: '0.95rem', fontFamily: 'Inter, sans-serif', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Categories</h4>
          {['Vegetables', 'Fruits', 'Dairy', 'Grains', 'Spices', 'Skincare'].map(cat => (
            <Link key={cat} to={`/products?category=${cat}`}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.65)', fontSize: '0.88rem', marginBottom: '10px', transition: 'color 0.2s' }}
              onMouseOver={e => e.currentTarget.style.color = '#74C69D'}
              onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.65)'}>
              <span style={{ color: '#74C69D', fontSize: '0.6rem' }}>▶</span> {cat}
            </Link>
          ))}
        </div>

        {/* ── Contact ── */}
        <div>
          <h4 style={{ color: 'white', marginBottom: '16px', fontSize: '0.95rem', fontFamily: 'Inter, sans-serif', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Contact Us</h4>

          {/* Email */}
          <a href="mailto:sujaybj8@gmail.com"
            style={{ display: 'flex', gap: '10px', marginBottom: '14px', alignItems: 'flex-start', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseOver={e => e.currentTarget.style.opacity = '0.8'}
            onMouseOut={e => e.currentTarget.style.opacity = '1'}>
            <FaEnvelope style={{ color: '#74C69D', fontSize: '0.9rem', marginTop: '3px', flexShrink: 0 }} />
            <span style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>sujaybj8@gmail.com</span>
          </a>

          {/* Phone */}
          <a href="tel:+917899998321"
            style={{ display: 'flex', gap: '10px', marginBottom: '14px', alignItems: 'flex-start', textDecoration: 'none' }}
            onMouseOver={e => e.currentTarget.style.opacity = '0.8'}
            onMouseOut={e => e.currentTarget.style.opacity = '1'}>
            <FaPhone style={{ color: '#74C69D', fontSize: '0.9rem', marginTop: '3px', flexShrink: 0 }} />
            <span style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>+91 78999 98321</span>
          </a>

          {/* Address */}
          <a href="https://maps.google.com/?q=JP+Nagar,+Bangalore" target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', gap: '10px', marginBottom: '20px', alignItems: 'flex-start', textDecoration: 'none' }}
            onMouseOver={e => e.currentTarget.style.opacity = '0.8'}
            onMouseOut={e => e.currentTarget.style.opacity = '1'}>
            <FaMapMarkerAlt style={{ color: '#74C69D', fontSize: '0.9rem', marginTop: '3px', flexShrink: 0 }} />
            <span style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
              J P Nagar, Bangalore<br />Karnataka, India
            </span>
          </a>

          {/* Certifications */}
          <div>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Certified by</p>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {['FSSAI', 'India Organic', 'Non-GMO'].map(cert => (
                <span key={cert} style={{ background: 'rgba(116,198,157,0.15)', border: '1px solid rgba(116,198,157,0.3)', borderRadius: '4px', padding: '3px 8px', fontSize: '0.7rem', color: '#74C69D', fontWeight: 600 }}>
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* ── Bottom Bar ── */}
    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '18px 0' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
          © 2025 GreenRoots Organics. All rights reserved.
        </p>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {['Privacy Policy', 'Terms of Service', 'Return Policy'].map(label => (
            <a key={label} href="#"
              style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseOver={e => e.target.style.color = '#74C69D'}
              onMouseOut={e => e.target.style.color = 'rgba(255,255,255,0.4)'}>
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
