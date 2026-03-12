import React from 'react';
import { Helmet } from 'react-helmet-async';

const About = () => (
  <>
    <Helmet><title>About Us - GreenRoots Organics</title></Helmet>

    {/* Hero */}
    <section style={{ background: 'linear-gradient(135deg,#1B4332,#2D6A4F)', padding: 'clamp(48px,8vw,80px) 20px', textAlign: 'center', color: 'white' }}>
      <h1 style={{ fontSize: 'clamp(1.8rem,5vw,3rem)', fontFamily: 'Playfair Display, serif' }}>Our Organic Story</h1>
      <p style={{ marginTop: '16px', opacity: 0.85, maxWidth: '600px', margin: '16px auto 0', fontSize: 'clamp(0.9rem,2vw,1.1rem)', lineHeight: 1.8 }}>
        Born from a passion for clean, honest food — we connect farmers who care deeply about the earth with families who care deeply about their health.
      </p>
    </section>

    <div className="container" style={{ paddingTop: 'clamp(36px,6vw,64px)', paddingBottom: 'clamp(36px,6vw,64px)' }}>

      {/* Mission */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 'clamp(24px,5vw,48px)', alignItems: 'center', marginBottom: 'clamp(48px,8vw,80px)' }}>
        <div>
          <span style={{ color: '#2D6A4F', fontWeight: 600, fontSize: '0.85rem', letterSpacing: '2px', textTransform: 'uppercase' }}>Our Mission</span>
          <h2 style={{ fontSize: 'clamp(1.4rem,4vw,2rem)', marginTop: '12px', marginBottom: '16px' }}>Nourishing Families, Sustaining the Planet</h2>
          <p style={{ color: '#4B5563', lineHeight: 1.9, marginBottom: '12px', fontSize: 'clamp(0.88rem,2vw,0.95rem)' }}>
            Founded in 2020 in Bangalore, GreenRoots was built on one simple belief: food should be good for you and good for the earth. No shortcuts, no compromises.
          </p>
          <p style={{ color: '#4B5563', lineHeight: 1.9, fontSize: 'clamp(0.88rem,2vw,0.95rem)' }}>
            We partner with 200+ certified organic farmers across Karnataka, Tamil Nadu, and Maharashtra, ensuring every product meets the highest organic standards before it reaches your table.
          </p>
        </div>
        <div style={{ fontSize: 'clamp(80px,15vw,120px)', textAlign: 'center' }}>🌾</div>
      </div>

      {/* Stats */}
      <div style={{ background: '#2D6A4F', borderRadius: '20px', padding: 'clamp(28px,5vw,48px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))', gap: 'clamp(18px,3vw,32px)', marginBottom: 'clamp(48px,8vw,80px)' }}>
        {[['200+','Partner Farms'],['500+','Products'],['50,000+','Happy Families'],['100%','Certified Organic'],['5','Years Experience']].map(([num,label]) => (
          <div key={label} style={{ textAlign: 'center', color: 'white' }}>
            <div style={{ fontSize: 'clamp(1.6rem,4vw,2.2rem)', fontFamily: 'Playfair Display, serif', fontWeight: 700, color: '#74C69D' }}>{num}</div>
            <div style={{ fontSize: 'clamp(0.78rem,1.8vw,0.9rem)', opacity: 0.85, marginTop: '6px' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Values */}
      <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.4rem,4vw,2rem)', marginBottom: 'clamp(24px,4vw,40px)' }}>Our Core Values</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 'clamp(12px,2vw,20px)' }}>
        {[
          {icon:'🌿',title:'Transparency',desc:'Every product comes with full farm traceability and lab test reports.'},
          {icon:'🤝',title:'Fair Trade',desc:'We pay farmers 30% above market rates to support sustainable livelihoods.'},
          {icon:'♻️',title:'Sustainability',desc:'From biodegradable packaging to carbon-neutral logistics.'},
          {icon:'❤️',title:'Community',desc:'Giving 1% of every sale to organic farming education programs.'},
        ].map(val => (
          <div key={val.title} style={{ background: 'white', borderRadius: '16px', padding: 'clamp(18px,3vw,28px)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', transition: 'transform 0.2s' }}
            onMouseOver={e => e.currentTarget.style.transform='translateY(-4px)'}
            onMouseOut={e => e.currentTarget.style.transform='none'}>
            <div style={{ fontSize: 'clamp(1.8rem,4vw,2.5rem)', marginBottom: '14px' }}>{val.icon}</div>
            <h3 style={{ fontFamily: 'Inter,sans-serif', fontWeight: 700, marginBottom: '8px', fontSize: 'clamp(0.95rem,2vw,1.05rem)' }}>{val.title}</h3>
            <p style={{ color: '#6B7280', fontSize: 'clamp(0.82rem,2vw,0.9rem)', lineHeight: 1.7 }}>{val.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </>
);

export default About;
