import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Mail, Phone, MapPin, Instagram, Facebook, Twitter, Youtube } from 'lucide-react';

const SOCIALS = [
  { Icon: Instagram, href: 'https://instagram.com/sujay_achrya_18',   bg: 'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)', label: 'Instagram' },
  { Icon: Facebook,  href: 'https://facebook.com/SujayAcharyaSujay', bg: '#1877F2', label: 'Facebook' },
  { Icon: Twitter,   href: 'https://x.com/Sujay',                    bg: '#000000', label: 'Twitter'  },
  { Icon: Youtube,   href: 'https://youtube.com/@SrujanAcharBalige', bg: '#FF0000', label: 'YouTube'  },
];

const Footer = () => (
  <footer style={{ background: '#1B4332', color: 'rgba(255,255,255,0.85)', paddingTop: '48px' }}>
    <div className="container">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '36px', paddingBottom: '40px' }}>

        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Leaf size={20} color="#74C69D" strokeWidth={1.8}/>
            <span style={{ fontFamily: 'Playfair Display,serif', fontSize: '1.2rem', fontWeight: 700, color: 'white' }}>GreenRoots</span>
          </div>
          <p style={{ fontSize: '0.86rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.65)', marginBottom: '20px' }}>
            Fresh, natural products delivered to your door. Pure goodness your family deserves.
          </p>
          {/* Social icons */}
          <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Follow Us</p>
          <div style={{ display: 'flex', gap: '8px' }}>
            {SOCIALS.map(({ Icon, href, bg, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                style={{ background: bg, borderRadius: '8px', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s, opacity 0.2s', textDecoration: 'none' }}
                onMouseOver={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.opacity='0.85'; }}
                onMouseOut={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.opacity='1'; }}>
                <Icon size={15} color="white" strokeWidth={1.8}/>
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ color: 'white', marginBottom: '16px', fontSize: '0.9rem', fontFamily: 'Inter,sans-serif', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Quick Links</h4>
          {[['/', 'Home'], ['/products', 'Shop Now'], ['/about', 'About Us'], ['/contact', 'Contact'], ['/orders', 'My Orders']].map(([path, label]) => (
            <Link key={path} to={path}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.65)', fontSize: '0.86rem', marginBottom: '10px', transition: 'color 0.2s', textDecoration: 'none' }}
              onMouseOver={e => e.currentTarget.style.color = '#74C69D'}
              onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.65)'}>
              <span style={{ color: '#74C69D', fontSize: '0.55rem' }}>▶</span> {label}
            </Link>
          ))}
        </div>

        {/* Contact */}
        <div>
          <h4 style={{ color: 'white', marginBottom: '16px', fontSize: '0.9rem', fontFamily: 'Inter,sans-serif', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Contact Us</h4>

          <a href="mailto:sujaybj8@gmail.com"
            style={{ display: 'flex', gap: '10px', marginBottom: '14px', alignItems: 'center', textDecoration: 'none', opacity: 0.85 }}
            onMouseOver={e => e.currentTarget.style.opacity='1'} onMouseOut={e => e.currentTarget.style.opacity='0.85'}>
            <Mail size={15} color="#74C69D" strokeWidth={1.8} style={{ flexShrink: 0 }}/>
            <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>sujaybj8@gmail.com</span>
          </a>

          <a href="tel:+917899998321"
            style={{ display: 'flex', gap: '10px', marginBottom: '14px', alignItems: 'center', textDecoration: 'none', opacity: 0.85 }}
            onMouseOver={e => e.currentTarget.style.opacity='1'} onMouseOut={e => e.currentTarget.style.opacity='0.85'}>
            <Phone size={15} color="#74C69D" strokeWidth={1.8} style={{ flexShrink: 0 }}/>
            <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>+91 78999 98321</span>
          </a>

          <a href="https://maps.google.com/?q=JP+Nagar+Bangalore" target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', gap: '10px', marginBottom: '20px', alignItems: 'flex-start', textDecoration: 'none', opacity: 0.85 }}
            onMouseOver={e => e.currentTarget.style.opacity='1'} onMouseOut={e => e.currentTarget.style.opacity='0.85'}>
            <MapPin size={15} color="#74C69D" strokeWidth={1.8} style={{ flexShrink: 0, marginTop: '2px' }}/>
            <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>J P Nagar, Bangalore<br/>Karnataka, India</span>
          </a>

          <div>
            <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Certified by</p>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {['FSSAI', 'Non-GMO'].map(cert => (
                <span key={cert} style={{ background: 'rgba(116,198,157,0.15)', border: '1px solid rgba(116,198,157,0.3)', borderRadius: '4px', padding: '2px 8px', fontSize: '0.68rem', color: '#74C69D', fontWeight: 600 }}>
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Bottom bar */}
    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '16px 0' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>© 2025 GreenRoots Organics. All rights reserved.</p>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {['Privacy Policy', 'Terms of Service', 'Return Policy'].map(label => (
            <a key={label} href="#" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseOver={e => e.target.style.color='#74C69D'} onMouseOut={e => e.target.style.color='rgba(255,255,255,0.4)'}>
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
