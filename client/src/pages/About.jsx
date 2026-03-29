// About.jsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

export const About = () => (
  <>
    <Helmet><title>About Us - GreenRoots Organics</title></Helmet>

    {/* Hero */}
    <section style={{ background: 'linear-gradient(135deg, #1B4332, #2D6A4F)', padding: '80px 20px', textAlign: 'center', color: 'white' }}>
      <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontFamily: 'Playfair Display, serif' }}>Our Organic Story</h1>
        <p style={{ marginTop: '16px', opacity: 0.85, maxWidth: '600px', margin: '16px auto 0', fontSize: '1.1rem', lineHeight: 1.8 }}>
          Born from a passion for clean, honest food — we connect farmers who care deeply about the earth with families who care deeply about their health.
        </p>
      </motion.div>
    </section>

    <div className="container" style={{ paddingTop: '64px', paddingBottom: '64px' }}>
      {/* Mission */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px', alignItems: 'center', marginBottom: '80px' }}>
        <div>
          <span style={{ color: '#2D6A4F', fontWeight: 600, fontSize: '0.9rem', letterSpacing: '2px', textTransform: 'uppercase' }}>Our Mission</span>
          <h2 style={{ fontSize: '2rem', marginTop: '12px', marginBottom: '16px' }}>Nourishing Families, Sustaining the Planet</h2>
          <p style={{ color: '#4B5563', lineHeight: 1.9, marginBottom: '12px' }}>
            Founded in 2020 in Bangalore, GreenRoots was built on one simple belief: food should be good for you and good for the earth. No shortcuts, no compromises.
          </p>
          <p style={{ color: '#4B5563', lineHeight: 1.9 }}>
            We partner with 200+ farmers across Karnataka, Tamil Nadu, and Maharashtra, ensuring every product meets the highest organic standards before it reaches your table.
          </p>
        </div>
        <div style={{ fontSize: '120px', textAlign: 'center' }}>🌾</div>
      </div>

      {/* Stats */}
      <div style={{ background: '#2D6A4F', borderRadius: '20px', padding: '48px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '32px', marginBottom: '80px' }}>
        {[['200+', 'Partner Farms'], ['500+', 'Products'], ['50,000+', 'Happy Families'], ['100%', 'Quality Products'], ['5', 'Years Experience']].map(([num, label]) => (
          <div key={label} style={{ textAlign: 'center', color: 'white' }}>
            <div style={{ fontSize: '2.2rem', fontFamily: 'Playfair Display, serif', fontWeight: 700, color: '#74C69D' }}>{num}</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.85, marginTop: '6px' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Values */}
      <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '40px' }}>Our Core Values</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        {[
          { icon: '🌿', title: 'Transparency', desc: 'Every product comes with full farm traceability and lab test reports.' },
          { icon: '🤝', title: 'Fair Trade', desc: 'We pay farmers 30% above market rates to support sustainable livelihoods.' },
          { icon: '♻️', title: 'Sustainability', desc: 'From biodegradable packaging to carbon-neutral logistics.' },
          { icon: '❤️', title: 'Community', desc: 'Giving 1% of every sale to organic farming education programs.' },
        ].map(val => (
          <div key={val.title} style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{val.icon}</div>
            <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, marginBottom: '8px' }}>{val.title}</h3>
            <p style={{ color: '#6B7280', fontSize: '0.9rem', lineHeight: 1.7 }}>{val.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </>
);

export default About;
