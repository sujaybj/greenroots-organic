import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Truck, MapPin, Clock, Shield, Leaf, Users, Package, Star } from 'lucide-react';

const About = () => (
  <>
    <Helmet><title>About Us - GreenRoots Organics</title></Helmet>

    {/* ── Hero ── */}
    <section style={{ position: 'relative', overflow: 'hidden', padding: '80px 20px', textAlign: 'center', color: 'white' }}>
      <img
        src="https://images.unsplash.com/photo-1543168256-418811576931?w=1600&q=85&auto=format&fit=crop"
        alt="Delivery team"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 50%' }}
      />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(27,67,50,0.92), rgba(45,106,79,0.85))' }}/>
      <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ position: 'relative', zIndex: 1 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(116,198,157,0.25)', color: '#74C69D', padding: '5px 14px', borderRadius: '100px', fontSize: '0.78rem', fontWeight: 700, border: '1px solid rgba(116,198,157,0.35)', marginBottom: '18px' }}>
          <Truck size={12}/> Farm to Doorstep
        </span>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontFamily: 'Playfair Display, serif', marginBottom: '16px' }}>
          Our Delivery Story
        </h1>
        <p style={{ opacity: 0.88, maxWidth: '580px', margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.8 }}>
          Born from a passion for clean food and reliable delivery — we connect farmers who care deeply about the earth with families who deserve the freshest produce at their door.
        </p>
      </motion.div>
    </section>

    <div className="container" style={{ paddingTop: '64px', paddingBottom: '64px' }}>

      {/* ── Mission ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '48px', alignItems: 'center', marginBottom: '80px' }}>
        <div>
          <span style={{ color: '#2D6A4F', fontWeight: 600, fontSize: '0.85rem', letterSpacing: '2px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
            <Leaf size={14}/> Our Mission
          </span>
          <h2 style={{ fontSize: '2rem', marginBottom: '16px', lineHeight: 1.3 }}>Nourishing Families,<br/>Delivered With Care</h2>
          <p style={{ color: '#4B5563', lineHeight: 1.9, marginBottom: '12px' }}>
            Founded in 2020 in Bangalore, GreenRoots was built on one simple belief: organic food should reach your table as fresh as it left the farm. We built a delivery network that makes that possible — every single day.
          </p>
          <p style={{ color: '#4B5563', lineHeight: 1.9 }}>
            We partner with 200+ farmers across Karnataka, Tamil Nadu, and Maharashtra, and our fleet of cold-chain delivery agents ensures every order arrives pristine and on time.
          </p>
        </div>
        <div style={{ background: '#F0FDF4', borderRadius: '20px', padding: '32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {[
            { Icon: Truck,   label: 'Same-day delivery',    sub: 'Order by noon' },
            { Icon: MapPin,  label: 'Live GPS tracking',    sub: 'Real-time updates' },
            { Icon: Clock,   label: '2-hr delivery window', sub: 'No waiting around' },
            { Icon: Shield,  label: 'Verified agents',      sub: 'Background checked' },
          ].map(({ Icon, label, sub }) => (
            <div key={label} style={{ background: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #D1FAE5' }}>
              <div style={{ background: '#D1FAE5', borderRadius: '8px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                <Icon size={16} color="#2D6A4F"/>
              </div>
              <p style={{ fontWeight: 700, fontSize: '0.82rem', color: '#1B1B1B', margin: '0 0 3px' }}>{label}</p>
              <p style={{ fontSize: '0.72rem', color: '#9CA3AF', margin: 0 }}>{sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Stats ── */}
      <div style={{ background: 'linear-gradient(135deg, #1B4332, #2D6A4F)', borderRadius: '20px', padding: '48px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '32px', marginBottom: '80px' }}>
        {[
          ['200+', 'Partner Farms'],
          ['500+', 'Products'],
          ['50,000+', 'Happy Families'],
          ['100%', 'Organic Certified'],
          ['5', 'Years Delivering'],
        ].map(([num, label]) => (
          <div key={label} style={{ textAlign: 'center', color: 'white' }}>
            <div style={{ fontSize: '2.2rem', fontFamily: 'Playfair Display, serif', fontWeight: 700, color: '#74C69D' }}>{num}</div>
            <div style={{ fontSize: '0.85rem', opacity: 0.8, marginTop: '6px' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* ── Delivery Process ── */}
      <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '12px' }}>How Your Order Travels</h2>
      <p style={{ textAlign: 'center', color: '#6B7280', fontSize: '0.9rem', marginBottom: '40px' }}>From harvest to your hands — our delivery chain is built for freshness</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0', marginBottom: '80px', position: 'relative' }}>
        {[
          { Icon: Leaf,    step: '01', title: 'Harvested Fresh',    desc: 'Farmers harvest produce within 24hrs of your order being placed.' },
          { Icon: Package, step: '02', title: 'Packed & Sealed',    desc: 'Cold-stored and eco-packed to lock in freshness and nutrients.' },
          { Icon: Truck,   step: '03', title: 'Out for Delivery',   desc: 'Verified delivery agent picks up your order from our hub.' },
          { Icon: MapPin,  step: '04', title: 'At Your Doorstep',   desc: 'Live tracking lets you know the exact minute your order arrives.' },
        ].map(({ Icon, step, title, desc }, i) => (
          <div key={title} style={{ padding: '28px 20px', textAlign: 'center', borderRight: i < 3 ? '1px dashed #E5E7EB' : 'none', position: 'relative' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#74C69D', letterSpacing: '2px', marginBottom: '10px' }}>STEP {step}</div>
            <div style={{ background: '#F0FDF4', borderRadius: '50%', width: '52px', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', border: '2px solid #D1FAE5' }}>
              <Icon size={20} color="#2D6A4F"/>
            </div>
            <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '8px' }}>{title}</h3>
            <p style={{ color: '#6B7280', fontSize: '0.82rem', lineHeight: 1.7 }}>{desc}</p>
          </div>
        ))}
      </div>

      {/* ── Values ── */}
      <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '40px' }}>Our Core Values</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        {[
          { Icon: Leaf,   title: 'Transparency',  desc: 'Every product comes with full farm traceability and lab test reports.' },
          { Icon: Users,  title: 'Fair Trade',     desc: 'We pay farmers 30% above market rates to support sustainable livelihoods.' },
          { Icon: Truck,  title: 'Reliability',   desc: '98.5% on-time delivery rate — because your time matters as much as freshness.' },
          { Icon: Star,   title: 'Community',     desc: 'Giving 1% of every sale to organic farming education programs.' },
        ].map(({ Icon, title, desc }) => (
          <div key={title} style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6' }}>
            <div style={{ background: '#F0FDF4', borderRadius: '10px', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Icon size={18} color="#2D6A4F"/>
            </div>
            <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, marginBottom: '8px' }}>{title}</h3>
            <p style={{ color: '#6B7280', fontSize: '0.9rem', lineHeight: 1.7 }}>{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </>
);

export default About;
