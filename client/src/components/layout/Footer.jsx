import React from 'react';
import { Link } from 'react-router-dom';
import { FaLeaf, FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  const socialLinks = [
    { Icon: FaFacebookF,  href: '#', label: 'Facebook',  color: '#1877F2' },
    { Icon: FaInstagram,  href: '#', label: 'Instagram', color: '#E4405F' },
    { Icon: FaTwitter,    href: '#', label: 'Twitter',   color: '#1DA1F2' },
    { Icon: FaYoutube,    href: '#', label: 'YouTube',   color: '#FF0000' },
  ];

  const contactInfo = [
    { Icon: FaEnvelope,       text: 'hello@greenroots.in'        },
    { Icon: FaPhone,          text: '+91 98765 43210'             },
    { Icon: FaMapMarkerAlt,   text: 'Bangalore, Karnataka, India' },
  ];

  return (
    <footer style={{ background: '#1B4332', color: 'rgba(255,255,255,0.85)', paddingTop: '48px' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px', paddingBottom: '40px' }}>

          {/* ── Brand ── */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <FaLeaf style={{ color: '#74C69D', fontSize: '1.4rem' }} />
              <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', fontWeight: 700, color: 'white' }}>GreenRoots</span>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.7)' }}>
              Bringing pure, certified organic products from trusted farms directly to your doorstep.
            </p>
            {/* Social Icons */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              {socialLinks.map(({ Icon, href, label, color }) => (
                <a key={label} href={href} aria-label={label}
                  style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', cursor: 'pointer' }}
                  onMouseOver={e => { e.currentTarget.style.background = color; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = color; }}
                  onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}>
                  <Icon style={{ fontSize: '0.9rem', color: 'white' }} />
                </a>
              ))}
            </div>
          </div>

          {/* ── Quick Links ── */}
          <div>
            <h4 style={{ color: 'white', marginBottom: '16px', fontSize: '1rem', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Quick Links</h4>
            {[['/', 'Home'], ['/products', 'Shop Now'], ['/about', 'About Us'], ['/contact', 'Contact']].map(([path, label]) => (
              <Link key={path} to={path}
                style={{ display: 'block', color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', marginBottom: '10px', transition: 'color 0.2s' }}
                onMouseOver={e => e.target.style.color = '#74C69D'}
                onMouseOut={e => e.target.style.color = 'rgba(255,255,255,0.65)'}>
                {label}
              </Link>
            ))}
          </div>

          {/* ── Categories ── */}
          <div>
            <h4 style={{ color: 'white', marginBottom: '16px', fontSize: '1rem', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Categories</h4>
            {['Vegetables', 'Fruits', 'Dairy', 'Grains', 'Spices', 'Skincare'].map(cat => (
              <Link key={cat} to={`/products?category=${cat}`}
                style={{ display: 'block', color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', marginBottom: '10px', transition: 'color 0.2s' }}
                onMouseOver={e => e.target.style.color = '#74C69D'}
                onMouseOut={e => e.target.style.color = 'rgba(255,255,255,0.65)'}>
                {cat}
              </Link>
            ))}
          </div>

          {/* ── Contact ── */}
          <div>
            <h4 style={{ color: 'white', marginBottom: '16px', fontSize: '1rem', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Contact Us</h4>
            {contactInfo.map(({ Icon, text }) => (
              <div key={text} style={{ display: 'flex', gap: '10px', marginBottom: '14px', alignItems: 'flex-start' }}>
                <Icon style={{ color: '#74C69D', fontSize: '0.9rem', marginTop: '3px', flexShrink: 0 }} />
                <span style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>{text}</span>
              </div>
            ))}
            <div style={{ marginTop: '20px' }}>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', marginBottom: '8px' }}>Certified by</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['FSSAI', 'India Organic', 'Non-GMO'].map(cert => (
                  <span key={cert} style={{ background: 'rgba(116,198,157,0.15)', border: '1px solid rgba(116,198,157,0.3)', borderRadius: '4px', padding: '3px 8px', fontSize: '0.72rem', color: '#74C69D', fontWeight: 600 }}>
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '20px 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)' }}>© 2025 GreenRoots Organics. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '20px' }}>
            {['Privacy Policy', 'Terms of Service', 'Return Policy'].map(label => (
              <a key={label} href="#"
                style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', transition: 'color 0.2s' }}
                onMouseOver={e => e.target.style.color = '#74C69D'}
                onMouseOut={e => e.target.style.color = 'rgba(255,255,255,0.45)'}>
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
