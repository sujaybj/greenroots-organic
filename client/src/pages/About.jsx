import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Leaf, Handshake, Recycle, Heart,
  Users, Package, Home, BadgeCheck, Clock,
  ArrowRight, MapPin,
} from 'lucide-react';

const VALUES = [
  {
    Icon: Leaf,
    color: '#4CAF50', bg: '#E8F5E9',
    title: 'Transparency',
    desc: 'Every product comes with full farm traceability and lab test reports.',
  },
  {
    Icon: Handshake,
    color: '#2196F3', bg: '#E3F2FD',
    title: 'Fair Trade',
    desc: 'We pay farmers 30% above market rates to support sustainable livelihoods.',
  },
  {
    Icon: Recycle,
    color: '#8BC34A', bg: '#F1F8E9',
    title: 'Sustainability',
    desc: 'From biodegradable packaging to carbon-neutral logistics.',
  },
  {
    Icon: Heart,
    color: '#E91E63', bg: '#FCE4EC',
    title: 'Community',
    desc: 'Giving 1% of every sale to organic farming education programs.',
  },
];

const STATS = [
  { Icon: MapPin,     color: '#4CAF50', num: '200+',   label: 'Partner Farms'     },
  { Icon: Package,    color: '#2196F3', num: '500+',   label: 'Products'          },
  { Icon: Users,      color: '#FF9800', num: '50,000+',label: 'Happy Families'    },
  { Icon: BadgeCheck, color: '#74C69D', num: '100%',   label: 'Certified Organic' },
  { Icon: Clock,      color: '#9C27B0', num: '5',      label: 'Years Experience'  },
];

// Mission illustration — SVG farm scene
const MissionIllustration = () => (
  <svg viewBox="0 0 280 240" width="100%" style={{ maxWidth:'340px', margin:'0 auto', display:'block' }}>
    <rect width="280" height="240" rx="20" fill="#E8F5E9"/>
    {/* Sun */}
    <circle cx="230" cy="45" r="28" fill="rgba(255,220,80,0.25)"/>
    <circle cx="230" cy="45" r="18" fill="rgba(255,220,80,0.6)"/>
    {[0,60,120,180,240,300].map((a,i)=>(
      <line key={i}
        x1={230+22*Math.cos(a*Math.PI/180)} y1={45+22*Math.sin(a*Math.PI/180)}
        x2={230+32*Math.cos(a*Math.PI/180)} y2={45+32*Math.sin(a*Math.PI/180)}
        stroke="rgba(255,200,50,0.5)" strokeWidth="2" strokeLinecap="round"/>
    ))}
    {/* Ground */}
    <rect x="0" y="180" width="280" height="60" rx="12" fill="#A5D6A7"/>
    <rect x="0" y="195" width="280" height="45" rx="0" fill="#81C784"/>
    {/* Big tree */}
    <rect x="40" y="120" width="10" height="80" rx="4" fill="#5D4037"/>
    <circle cx="45" cy="105" r="28" fill="#2E7D32"/>
    <circle cx="30" cy="114" r="17" fill="#388E3C"/>
    <circle cx="60" cy="112" r="20" fill="#43A047"/>
    <circle cx="45" cy="92"  r="16" fill="#66BB6A"/>
    {/* Small tree */}
    <rect x="190" y="140" width="9" height="60" rx="3" fill="#5D4037"/>
    <circle cx="194" cy="126" r="22" fill="#2E7D32"/>
    <circle cx="181" cy="133" r="13" fill="#388E3C"/>
    <circle cx="207" cy="131" r="16" fill="#43A047"/>
    {/* Wheat stalks */}
    {[100,115,130,145,160].map((x,i)=>(
      <g key={i}>
        <line x1={x} y1={195} x2={x} y2={155} stroke="#827717" strokeWidth="2" strokeLinecap="round"/>
        <ellipse cx={x} cy={150} rx="4" ry="9" fill="#AFB42B"/>
        <line x1={x} y1={170} x2={x-8} y2={160} stroke="#9E9D24" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1={x} y1={170} x2={x+8} y2={160} stroke="#9E9D24" strokeWidth="1.5" strokeLinecap="round"/>
      </g>
    ))}
    {/* Basket */}
    <ellipse cx="240" cy="197" rx="22" ry="8" fill="#795548"/>
    <rect x="218" y="186" width="44" height="13" rx="5" fill="#8D6E63"/>
    <circle cx="230" cy="184" r="5" fill="#F44336"/>
    <circle cx="240" cy="181" r="4" fill="#FF9800"/>
    <circle cx="250" cy="183" r="5" fill="#4CAF50"/>
  </svg>
);

const About = () => (
  <>
    <Helmet><title>About Us - GreenRoots Organics</title></Helmet>

    {/* ── Hero ── */}
    <section style={{ background:'linear-gradient(135deg,#1B4332,#2D6A4F)', padding:'72px 20px', textAlign:'center', color:'white' }}>
      <motion.div initial={{ y:30,opacity:0 }} animate={{ y:0,opacity:1 }} transition={{ duration:0.6 }}>
        {/* Lucide Leaf icon — replaces fern emoji */}
        <div style={{ display:'flex', justifyContent:'center', marginBottom:'20px' }}>
          <div style={{ background:'rgba(116,198,157,0.2)', borderRadius:'50%', width:'72px', height:'72px', display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid rgba(116,198,157,0.35)' }}>
            <Leaf size={36} color="#74C69D" strokeWidth={1.6}/>
          </div>
        </div>
        <h1 style={{ fontSize:'clamp(2rem,4vw,3rem)', fontFamily:'Playfair Display,serif' }}>Our Organic Story</h1>
        <p style={{ marginTop:'16px', opacity:0.85, maxWidth:'580px', margin:'16px auto 0', fontSize:'1.05rem', lineHeight:1.9 }}>
          Born from a passion for clean, honest food — we connect farmers who care deeply about the earth with families who care deeply about their health.
        </p>
      </motion.div>
    </section>

    <div className="container" style={{ paddingTop:'64px', paddingBottom:'64px' }}>

      {/* ── Mission ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:'48px', alignItems:'center', marginBottom:'72px' }}>
        <motion.div initial={{ x:-30,opacity:0 }} whileInView={{ x:0,opacity:1 }} viewport={{ once:true }} transition={{ duration:0.6 }}>
          <span style={{ color:'#2D6A4F', fontWeight:700, fontSize:'0.78rem', letterSpacing:'2.5px', textTransform:'uppercase', display:'flex', alignItems:'center', gap:'6px' }}>
            <Leaf size={13} color="#2D6A4F" strokeWidth={2.5}/> Our Mission
          </span>
          <h2 style={{ fontSize:'clamp(1.6rem,3vw,2rem)', marginTop:'12px', marginBottom:'16px' }}>
            Nourishing Families,<br/>Sustaining the Planet
          </h2>
          <p style={{ color:'#4B5563', lineHeight:1.9, marginBottom:'12px' }}>
            Founded in 2020 in Bangalore, GreenRoots was built on one simple belief: food should be good for you and good for the earth. No shortcuts, no compromises.
          </p>
          <p style={{ color:'#4B5563', lineHeight:1.9, marginBottom:'24px' }}>
            We partner with 200+ certified organic farmers across Karnataka, Tamil Nadu, and Maharashtra, ensuring every product meets the highest organic standards before it reaches your table.
          </p>
          <Link to="/products" style={{ display:'inline-flex', alignItems:'center', gap:'8px', background:'#2D6A4F', color:'white', padding:'12px 24px', borderRadius:'8px', fontWeight:700, fontSize:'0.9rem', textDecoration:'none' }}>
            Shop Our Products <ArrowRight size={15}/>
          </Link>
        </motion.div>

        <motion.div initial={{ x:30,opacity:0 }} whileInView={{ x:0,opacity:1 }} viewport={{ once:true }} transition={{ duration:0.6, delay:0.15 }}>
          <MissionIllustration/>
        </motion.div>
      </div>

      {/* ── Stats ── */}
      <motion.div initial={{ y:30,opacity:0 }} whileInView={{ y:0,opacity:1 }} viewport={{ once:true }}
        style={{ background:'#2D6A4F', borderRadius:'20px', padding:'clamp(28px,5vw,48px)', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))', gap:'28px', marginBottom:'72px' }}>
        {STATS.map(({ Icon, color, num, label }) => (
          <div key={label} style={{ textAlign:'center' }}>
            <div style={{ display:'flex', justifyContent:'center', marginBottom:'10px' }}>
              <div style={{ background:'rgba(255,255,255,0.15)', borderRadius:'50%', width:'44px', height:'44px', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Icon size={20} color="#74C69D" strokeWidth={1.8}/>
              </div>
            </div>
            <div style={{ fontSize:'clamp(1.6rem,3vw,2.2rem)', fontFamily:'Playfair Display,serif', fontWeight:700, color:'#74C69D' }}>{num}</div>
            <div style={{ fontSize:'0.85rem', color:'rgba(255,255,255,0.8)', marginTop:'4px' }}>{label}</div>
          </div>
        ))}
      </motion.div>

      {/* ── Core Values ── */}
      <motion.div initial={{ y:20,opacity:0 }} whileInView={{ y:0,opacity:1 }} viewport={{ once:true }}>
        <h2 style={{ textAlign:'center', fontSize:'clamp(1.5rem,3vw,2rem)', marginBottom:'36px' }}>Our Core Values</h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:'20px' }}>
          {VALUES.map(({ Icon, color, bg, title, desc }, i) => (
            <motion.div key={title}
              initial={{ y:20,opacity:0 }} whileInView={{ y:0,opacity:1 }}
              viewport={{ once:true }} transition={{ delay: i*0.1 }}
              whileHover={{ y:-4 }}
              style={{ background:'white', borderRadius:'16px', padding:'28px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', border:'1px solid #F3F4F6' }}>
              <div style={{ background:bg, borderRadius:'50%', width:'52px', height:'52px', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'16px' }}>
                <Icon size={24} color={color} strokeWidth={1.8}/>
              </div>
              <h3 style={{ fontFamily:'Inter,sans-serif', fontWeight:700, fontSize:'1rem', marginBottom:'8px' }}>{title}</h3>
              <p style={{ color:'#6B7280', fontSize:'0.88rem', lineHeight:1.7 }}>{desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── CTA ── */}
      <motion.div initial={{ y:20,opacity:0 }} whileInView={{ y:0,opacity:1 }} viewport={{ once:true }}
        style={{ marginTop:'64px', background:'linear-gradient(135deg,#2D6A4F,#1B4332)', borderRadius:'20px', padding:'clamp(32px,5vw,48px)', textAlign:'center', color:'white' }}>
        <div style={{ display:'flex', justifyContent:'center', marginBottom:'16px' }}>
          <div style={{ background:'rgba(116,198,157,0.2)', borderRadius:'50%', width:'56px', height:'56px', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Home size={26} color="#74C69D" strokeWidth={1.8}/>
          </div>
        </div>
        <h3 style={{ fontSize:'clamp(1.3rem,3vw,1.8rem)', marginBottom:'10px' }}>Ready to Go Organic?</h3>
        <p style={{ color:'rgba(255,255,255,0.8)', marginBottom:'24px', fontSize:'0.95rem' }}>
          Join 50,000+ families living healthier with GreenRoots
        </p>
        <Link to="/products" style={{ background:'#74C69D', color:'#1B4332', fontWeight:700, padding:'13px 28px', borderRadius:'8px', fontSize:'0.95rem', textDecoration:'none', display:'inline-flex', alignItems:'center', gap:'8px' }}>
          Start Shopping <ArrowRight size={15}/>
        </Link>
      </motion.div>
    </div>
  </>
);

export default About;
