import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Leaf, Handshake, Recycle, Heart,
  Users, Package, MapPin, BadgeCheck, Clock,
  ArrowRight, Sprout, Quote,
} from 'lucide-react';

const VALUES = [
  { Icon: Leaf,       color: '#4CAF50', bg: '#E8F5E9', title: 'Transparency',  desc: 'Every product comes with full farm traceability and lab test reports.' },
  { Icon: Handshake,  color: '#2196F3', bg: '#E3F2FD', title: 'Fair Trade',    desc: 'We pay farmers 30% above market rates to support sustainable livelihoods.' },
  { Icon: Recycle,    color: '#8BC34A', bg: '#F1F8E9', title: 'Sustainability', desc: 'From biodegradable packaging to carbon-neutral logistics.' },
  { Icon: Heart,      color: '#E91E63', bg: '#FCE4EC', title: 'Community',     desc: 'Giving 1% of every sale to organic farming education programs.' },
];

const STATS = [
  { Icon: MapPin,     color: '#4CAF50', num: '200+',    label: 'Partner Farms'      },
  { Icon: Package,    color: '#2196F3', num: '500+',    label: 'Products'           },
  { Icon: Users,      color: '#FF9800', num: '50,000+', label: 'Happy Families'     },
  { Icon: BadgeCheck, color: '#74C69D', num: '100%',    label: 'Certified Organic'  },
  { Icon: Clock,      color: '#9C27B0', num: '5+',      label: 'Years of Experience'},
];

// Real Unsplash farm/organic photos
const FARM_PHOTOS = [
  { src: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&q=80', alt: 'Organic farm fields' },
  { src: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&q=80', alt: 'Fresh vegetables harvest' },
  { src: 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=600&q=80', alt: 'Organic produce' },
  { src: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&q=80', alt: 'Farm workers' },
];

const About = () => (
  <>
    <Helmet><title>About Us - GreenRoots Organics</title></Helmet>

    {/* ── Hero ── */}
    <section style={{ background: 'linear-gradient(135deg, #1B4332, #2D6A4F)', padding: '80px 20px', textAlign: 'center', color: 'white', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(116,198,157,0.08)' }}/>
      <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '220px', height: '220px', borderRadius: '50%', background: 'rgba(116,198,157,0.06)' }}/>
      <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }} style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <div style={{ background: 'rgba(116,198,157,0.2)', borderRadius: '50%', width: '72px', height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(116,198,157,0.3)' }}>
            <Sprout size={34} color="#74C69D" strokeWidth={1.6}/>
          </div>
        </div>
        <h1 style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontFamily: 'Playfair Display, serif' }}>Our Organic Story</h1>
        <p style={{ marginTop: '16px', opacity: 0.82, maxWidth: '560px', margin: '16px auto 0', fontSize: '1.05rem', lineHeight: 1.9 }}>
          Born from a passion for clean, honest food — we connect farmers who care deeply about the earth with families who care deeply about their health.
        </p>
      </motion.div>
    </section>

    <div className="container" style={{ paddingTop: '64px', paddingBottom: '64px' }}>

      {/* ── Mission — real photo ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '48px', alignItems: 'center', marginBottom: '80px' }}>
        <motion.div initial={{ x: -30, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <span style={{ color: '#2D6A4F', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '2.5px', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <Leaf size={12} color="#2D6A4F" strokeWidth={2.5}/> Our Mission
          </span>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2rem)', marginTop: '12px', marginBottom: '16px', lineHeight: 1.3 }}>
            Nourishing Families,<br/>Sustaining the Planet
          </h2>
          <p style={{ color: '#4B5563', lineHeight: 1.9, marginBottom: '12px', fontSize: '0.95rem' }}>
            Founded in 2020 in Bangalore, GreenRoots was built on one simple belief: food should be good for you and good for the earth. No shortcuts, no compromises.
          </p>
          <p style={{ color: '#4B5563', lineHeight: 1.9, marginBottom: '28px', fontSize: '0.95rem' }}>
            We partner with 200+ certified organic farmers across Karnataka, Tamil Nadu, and Maharashtra, ensuring every product meets the highest organic standards.
          </p>
          <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#2D6A4F', color: 'white', padding: '12px 24px', borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none' }}>
            Explore Products <ArrowRight size={15}/>
          </Link>
        </motion.div>

        {/* Real farm photo */}
        <motion.div initial={{ x: 30, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }}
          style={{ position: 'relative' }}>
          <img
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=700&q=85"
            alt="Organic farm fields"
            style={{ width: '100%', height: '360px', objectFit: 'cover', borderRadius: '20px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}
          />
          {/* Quote overlay */}
          <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px', background: 'rgba(27,67,50,0.9)', backdropFilter: 'blur(8px)', borderRadius: '12px', padding: '16px 20px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <Quote size={18} color="#74C69D" strokeWidth={1.8} style={{ flexShrink: 0, marginTop: '2px' }}/>
            <p style={{ color: 'white', fontSize: '0.82rem', lineHeight: 1.7, margin: 0, opacity: 0.9 }}>
              "We grow with love, so your family can eat with trust."
            </p>
          </div>
        </motion.div>
      </div>

      {/* ── Farm Photo Grid ── */}
      <motion.div initial={{ y: 30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}
        style={{ marginBottom: '80px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', marginBottom: '32px' }}>From Our Farms to Your Table</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
          {FARM_PHOTOS.map(({ src, alt }) => (
            <motion.div key={alt} whileHover={{ scale: 1.02 }} style={{ borderRadius: '14px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
              <img src={src} alt={alt} style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block', transition: 'transform 0.4s' }}
                onMouseOver={e => e.target.style.transform = 'scale(1.06)'}
                onMouseOut={e => e.target.style.transform = 'scale(1)'}/>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── Stats ── */}
      <motion.div initial={{ y: 30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}
        style={{ background: 'linear-gradient(135deg, #2D6A4F, #1B4332)', borderRadius: '24px', padding: 'clamp(28px, 5vw, 52px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '28px', marginBottom: '80px' }}>
        {STATS.map(({ Icon, color, num, label }) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
              <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={20} color="#74C69D" strokeWidth={1.8}/>
              </div>
            </div>
            <div style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontFamily: 'Playfair Display, serif', fontWeight: 700, color: '#74C69D' }}>{num}</div>
            <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.75)', marginTop: '4px' }}>{label}</div>
          </div>
        ))}
      </motion.div>

      {/* ── Values ── */}
      <motion.div initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}>
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.4rem, 3vw, 2rem)', marginBottom: '36px' }}>Our Core Values</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
          {VALUES.map(({ Icon, color, bg, title, desc }, i) => (
            <motion.div key={title}
              initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6' }}>
              <div style={{ background: bg, borderRadius: '12px', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Icon size={24} color={color} strokeWidth={1.8}/>
              </div>
              <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.98rem', marginBottom: '8px' }}>{title}</h3>
              <p style={{ color: '#6B7280', fontSize: '0.86rem', lineHeight: 1.7 }}>{desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── CTA ── */}
      <motion.div initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}
        style={{ marginTop: '64px', borderRadius: '20px', overflow: 'hidden', position: 'relative' }}>
        <img
          src="https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=1200&q=80"
          alt="Organic vegetables"
          style={{ width: '100%', height: '280px', objectFit: 'cover', display: 'block' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(27,67,50,0.88), rgba(45,106,79,0.82))', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '32px 20px' }}>
          <h3 style={{ color: 'white', fontSize: 'clamp(1.3rem, 3vw, 1.9rem)', marginBottom: '10px', fontFamily: 'Playfair Display, serif' }}>Ready to Go Organic?</h3>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '24px', fontSize: '0.95rem' }}>
            Join 50,000+ families living healthier with GreenRoots
          </p>
          <Link to="/products" style={{ background: '#74C69D', color: '#1B4332', fontWeight: 700, padding: '13px 28px', borderRadius: '8px', fontSize: '0.95rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            Start Shopping <ArrowRight size={15}/>
          </Link>
        </div>
      </motion.div>
    </div>
  </>
);

export default About;
