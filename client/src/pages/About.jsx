import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Sprout, Leaf, Handshake, Recycle, Heart } from 'lucide-react';

export const About = () => (
  <>
    <Helmet><title>About Us - GreenRoots Organics</title></Helmet>

    <section style={{ background: 'linear-gradient(135deg, #1B4332, #2D6A4F)', padding: '80px 20px', textAlign: 'center', color: 'white' }}>
      <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontFamily: 'Playfair Display, serif' }}>Our Organic Story</h1>
        <p style={{ marginTop: '16px', opacity: 0.85, maxWidth: '600px', margin: '16px auto 0', fontSize: '1.1rem', lineHeight: 1.8 }}>
          Born from a passion for clean, honest food - we connect farmers who care deeply about the earth with families who care deeply about their health.
        </p>
      </motion.div>
    </section>

    <div className="container" style={{ paddingTop: '64px', paddingBottom: '64px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px', alignItems: 'center', marginBottom: '80px' }}>
        <div>
          <span style={{ color: '#2D6A4F', fontWeight: 600, fontSize: '0.9rem', letterSpacing: '2px', textTransform: 'uppercase' }}>Our Mission</span>
          <h2 style={{ fontSize: '2rem', marginTop: '12px', marginBottom: '16px' }}>Nourishing Families, Sustaining the Planet</h2>
          <p style={{ color: '#4B5563', lineHeight: 1.9, marginBottom: '12px' }}>
            Founded in 2020 in Bangalore, GreenRoots was built on one simple belief: food should be good for you and good for the earth. No shortcuts, no compromises.
          </p>
          <p style={{ color: '#4B5563', lineHeight: 1.9 }}>
            We partner with 200+ farmers across Karnataka, Tamil Nadu, and Maharashtra, ensuring every product meets the highest quality standards before it reaches your table.
          </p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 140, height: 140, borderRadius: '50%', background: '#EAF9EF', border: '2px solid #CDEFD8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sprout size={72} color="#2D6A4F" strokeWidth={1.8} />
          </div>
        </div>
      </div>

      <div style={{ background: '#2D6A4F', borderRadius: '20px', padding: '48px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '32px', marginBottom: '80px' }}>
        {[['200+', 'Partner Farms'], ['500+', 'Products'], ['50,000+', 'Happy Families'], ['5-star', 'Rating'], ['5', 'Years Experience']].map(([num, label]) => (
          <div key={label} style={{ textAlign: 'center', color: 'white' }}>
            <div style={{ fontSize: '2.2rem', fontFamily: 'Playfair Display, serif', fontWeight: 700, color: '#74C69D' }}>{num}</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.85, marginTop: '6px' }}>{label}</div>
          </div>
        ))}
      </div>

      <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '40px' }}>Our Core Values</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        {[
          { Icon: Leaf, title: 'Transparency', desc: 'Every product comes with full farm traceability and lab test reports.' },
          { Icon: Handshake, title: 'Fair Trade', desc: 'We pay farmers 30% above market rates to support sustainable livelihoods.' },
          { Icon: Recycle, title: 'Sustainability', desc: 'From biodegradable packaging to carbon-neutral logistics.' },
          { Icon: Heart, title: 'Community', desc: 'Giving 1% of every sale to sustainable farming education programs.' },
        ].map((val) => (
          <div key={val.title} style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: '#EAF9EF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <val.Icon size={28} color="#2D6A4F" strokeWidth={2} />
            </div>
            <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, marginBottom: '8px' }}>{val.title}</h3>
            <p style={{ color: '#6B7280', fontSize: '0.9rem', lineHeight: 1.7 }}>{val.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </>
);

export default About;
