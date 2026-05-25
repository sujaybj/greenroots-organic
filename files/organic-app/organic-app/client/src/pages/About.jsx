import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Leaf, Handshake, Recycle, Heart,
  Users, Package, MapPin, Clock, ArrowLeft, ArrowRight,
  Sprout, FlaskConical, Truck, Quote,
} from 'lucide-react';

// ── Single professional SVG illustration ─────────────────────
const FarmIllustration = () => (
  <svg viewBox="0 0 480 320" width="100%" style={{ maxWidth: '480px', display: 'block' }}>
    {/* Sky */}
    <defs>
      <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#1B4332', stopOpacity: 1 }}/>
        <stop offset="100%" style={{ stopColor: '#2D6A4F', stopOpacity: 1 }}/>
      </linearGradient>
      <linearGradient id="groundGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#52B788', stopOpacity: 1 }}/>
        <stop offset="100%" style={{ stopColor: '#40916C', stopOpacity: 1 }}/>
      </linearGradient>
      <linearGradient id="sunGrad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%" gradientUnits="objectBoundingBox">
        <stop offset="0%" style={{ stopColor: '#FFD60A', stopOpacity: 0.9 }}/>
        <stop offset="100%" style={{ stopColor: '#FFC300', stopOpacity: 0.6 }}/>
      </linearGradient>
    </defs>

    {/* Background */}
    <rect width="480" height="320" fill="url(#skyGrad)" rx="16"/>

    {/* Sun */}
    <circle cx="400" cy="60" r="35" fill="#FFD60A" opacity="0.25"/>
    <circle cx="400" cy="60" r="22" fill="#FFD60A" opacity="0.7"/>
    {[0,45,90,135,180,225,270,315].map((a,i) => (
      <line key={i}
        x1={400+26*Math.cos(a*Math.PI/180)} y1={60+26*Math.sin(a*Math.PI/180)}
        x2={400+38*Math.cos(a*Math.PI/180)} y2={60+38*Math.sin(a*Math.PI/180)}
        stroke="#FFD60A" strokeWidth="2.5" strokeLinecap="round" opacity="0.7"/>
    ))}

    {/* Distant hills */}
    <ellipse cx="120" cy="210" rx="130" ry="55" fill="#1B4332" opacity="0.5"/>
    <ellipse cx="340" cy="220" rx="170" ry="50" fill="#1B4332" opacity="0.4"/>

    {/* Ground */}
    <rect x="0" y="230" width="480" height="90" fill="url(#groundGrad)" rx="0"/>
    <rect x="0" y="240" width="480" height="80" fill="#40916C"/>

    {/* Farmhouse */}
    <rect x="30" y="160" width="90" height="75" fill="#8B5E3C" rx="3"/>
    <polygon points="20,163 120,163 70,120" fill="#6B4226"/>
    <rect x="55" y="200" width="25" height="35" fill="#4A3728" rx="2"/>
    <rect x="38" y="170" width="18" height="18" fill="#87CEEB" rx="2" opacity="0.7"/>
    <rect x="85" y="170" width="18" height="18" fill="#87CEEB" rx="2" opacity="0.7"/>
    <rect x="67" y="125" width="6" height="18" fill="#74C69D"/>

    {/* Big tree */}
    <rect x="148" y="160" width="10" height="75" rx="3" fill="#6B4226"/>
    <circle cx="153" cy="142" r="32" fill="#2D6A4F"/>
    <circle cx="136" cy="152" r="20" fill="#40916C"/>
    <circle cx="170" cy="150" r="24" fill="#52B788"/>
    <circle cx="153" cy="126" r="18" fill="#74C69D"/>

    {/* Wheat field rows */}
    {[210,230,250,270,290].map((x,i) => (
      <g key={i}>
        <line x1={x} y1="240" x2={x} y2="200" stroke="#A68B2D" strokeWidth="2" strokeLinecap="round"/>
        <ellipse cx={x} cy="196" rx="4" ry="9" fill="#D4A017" opacity="0.9"/>
        <line x1={x} y1="218" x2={x-8} y2="208" stroke="#B8961E" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1={x} y1="218" x2={x+8} y2="208" stroke="#B8961E" strokeWidth="1.5" strokeLinecap="round"/>
      </g>
    ))}

    {/* Right tree */}
    <rect x="328" y="165" width="10" height="70" rx="3" fill="#6B4226"/>
    <circle cx="333" cy="148" r="28" fill="#2D6A4F"/>
    <circle cx="318" cy="157" r="17" fill="#40916C"/>
    <circle cx="348" cy="155" r="20" fill="#52B788"/>

    {/* Harvest basket */}
    <ellipse cx="390" cy="244" rx="28" ry="10" fill="#795548"/>
    <rect x="362" y="232" width="56" height="14" rx="6" fill="#8D6E63"/>
    <circle cx="374" cy="230" r="7" fill="#E53935"/>
    <circle cx="390" cy="226" r="6" fill="#FF9800"/>
    <circle cx="406" cy="229" r="7" fill="#66BB6A"/>

    {/* Tractor */}
    <rect x="60" y="232" width="50" height="24" rx="4" fill="#D32F2F"/>
    <rect x="90" y="228" width="24" height="16" rx="3" fill="#B71C1C"/>
    <circle cx="72" cy="258" r="10" fill="#424242"/>
    <circle cx="72" cy="258" r="5" fill="#757575"/>
    <circle cx="102" cy="258" r="8" fill="#424242"/>
    <circle cx="102" cy="258" r="4" fill="#757575"/>

    {/* Sparkles */}
    {[[450,40],[20,100],[240,50],[460,180]].map(([x,y],i) => (
      <g key={i} opacity="0.5">
        <circle cx={x} cy={y} r="2" fill="white"/>
        <line x1={x-5} y1={y} x2={x+5} y2={y} stroke="white" strokeWidth="1"/>
        <line x1={x} y1={y-5} x2={x} y2={y+5} stroke="white" strokeWidth="1"/>
      </g>
    ))}

    {/* Floating leaves */}
    <path d="M460 100 Q470 90 465 105 Q455 115 460 100Z" fill="#74C69D" opacity="0.6"/>
    <path d="M18 180 Q28 170 23 185 Q13 195 18 180Z" fill="#74C69D" opacity="0.5"/>
  </svg>
);

const VALUES = [
  { Icon: Leaf,       color: '#4CAF50', bg: '#E8F5E9', title: 'Transparency',  desc: 'Full farm traceability and quality reports for every product.' },
  { Icon: Handshake,  color: '#2196F3', bg: '#E3F2FD', title: 'Fair Trade',    desc: 'We pay farmers above market rates to support sustainable livelihoods.' },
  { Icon: Recycle,    color: '#8BC34A', bg: '#F1F8E9', title: 'Sustainability', desc: 'Biodegradable packaging and eco-conscious logistics.' },
  { Icon: Heart,      color: '#E91E63', bg: '#FCE4EC', title: 'Community',     desc: 'Contributing 1% of every sale to sustainable farming initiatives.' },
];

const STATS = [
  { Icon: MapPin,  color: '#4CAF50', num: '200+',    label: 'Partner Farms'    },
  { Icon: Package, color: '#2196F3', num: '500+',    label: 'Products'         },
  { Icon: Users,   color: '#FF9800', num: '50,000+', label: 'Happy Families'   },
  { Icon: Clock,   color: '#9C27B0', num: '5+',      label: 'Years Experience' },
];

const About = () => {
  const navigate = useNavigate();
  return (
    <>
      <Helmet><title>About Us — GreenRoots Organics</title></Helmet>

      {/* ── Back nav ── */}
      <div className="container" style={{ paddingTop: '16px' }}>
        <button onClick={() => navigate(-1)} className="btn-back">
          <ArrowLeft size={14}/> Back
        </button>
      </div>

      {/* ── Hero ── */}
      <section style={{ background: 'linear-gradient(135deg,#1B4332,#2D6A4F)', overflow: 'hidden', position: 'relative' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '0', alignItems: 'center', padding: '60px clamp(16px,4vw,32px)' }}>
          <motion.div initial={{ x:-30,opacity:0 }} animate={{ x:0,opacity:1 }} transition={{ duration:0.6 }} style={{ color:'white', zIndex:1 }}>
            <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'20px' }}>
              <div style={{ background:'rgba(116,198,157,0.2)', borderRadius:'50%', width:'56px', height:'56px', display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid rgba(116,198,157,0.3)' }}>
                <Sprout size={28} color="#74C69D" strokeWidth={1.6}/>
              </div>
              <span style={{ color:'#74C69D', fontWeight:700, fontSize:'0.78rem', letterSpacing:'2.5px', textTransform:'uppercase' }}>Our Story</span>
            </div>
            <h1 style={{ fontSize:'clamp(1.8rem,4vw,3rem)', fontFamily:'Playfair Display,serif', lineHeight:1.2, marginBottom:'16px' }}>
              Nourishing Families,<br/>Sustaining the Planet
            </h1>
            <p style={{ opacity:0.8, fontSize:'clamp(0.9rem,1.5vw,1.05rem)', lineHeight:1.9, maxWidth:'480px', marginBottom:'28px' }}>
              Born from a passion for honest food — we connect farmers who care about the earth with families who care about their health. No shortcuts. No compromises.
            </p>
            <Link to="/products" style={{ display:'inline-flex', alignItems:'center', gap:'8px', background:'#74C69D', color:'#1B4332', padding:'12px 24px', borderRadius:'9px', fontWeight:700, fontSize:'0.9rem', textDecoration:'none' }}>
              Shop Our Products <ArrowRight size={15}/>
            </Link>
          </motion.div>

          {/* SVG illustration */}
          <motion.div initial={{ x:30,opacity:0 }} animate={{ x:0,opacity:1 }} transition={{ duration:0.6,delay:0.15 }}
            style={{ display:'flex', justifyContent:'center', padding:'20px 0' }}>
            <FarmIllustration/>
          </motion.div>
        </div>
      </section>

      <div className="container" style={{ paddingTop:'56px', paddingBottom:'64px' }}>

        {/* ── Stats ── */}
        <motion.div initial={{ y:30,opacity:0 }} whileInView={{ y:0,opacity:1 }} viewport={{ once:true }}
          style={{ background:'linear-gradient(135deg,#2D6A4F,#1B4332)', borderRadius:'20px', padding:'clamp(24px,4vw,44px)', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))', gap:'24px', marginBottom:'72px' }}>
          {STATS.map(({ Icon, color, num, label }) => (
            <div key={label} style={{ textAlign:'center' }}>
              <div style={{ display:'flex', justifyContent:'center', marginBottom:'10px' }}>
                <div style={{ background:'rgba(255,255,255,0.12)', borderRadius:'50%', width:'42px', height:'42px', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Icon size={19} color="#74C69D" strokeWidth={1.8}/>
                </div>
              </div>
              <div style={{ fontSize:'clamp(1.5rem,3vw,2.1rem)', fontFamily:'Playfair Display,serif', fontWeight:700, color:'#74C69D' }}>{num}</div>
              <div style={{ fontSize:'0.8rem', color:'rgba(255,255,255,0.75)', marginTop:'4px' }}>{label}</div>
            </div>
          ))}
        </motion.div>

        {/* ── Mission with quote ── */}
        <motion.div initial={{ y:20,opacity:0 }} whileInView={{ y:0,opacity:1 }} viewport={{ once:true }}
          style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:'40px', alignItems:'center', marginBottom:'72px' }}>
          <div>
            <span style={{ color:'#2D6A4F', fontWeight:700, fontSize:'0.75rem', letterSpacing:'2.5px', textTransform:'uppercase', display:'inline-flex', alignItems:'center', gap:'5px' }}>
              <Leaf size={12} color="#2D6A4F" strokeWidth={2.5}/> Founded in Bangalore, 2020
            </span>
            <h2 style={{ fontSize:'clamp(1.5rem,3vw,1.9rem)', marginTop:'10px', marginBottom:'14px', lineHeight:1.3 }}>
              Why We Started
            </h2>
            <p style={{ color:'#4B5563', lineHeight:1.9, marginBottom:'14px', fontSize:'0.94rem' }}>
              We partner with 200+ farmers across Karnataka, Tamil Nadu, and Maharashtra, ensuring every product meets the highest quality standards before it reaches your table.
            </p>
            <p style={{ color:'#4B5563', lineHeight:1.9, fontSize:'0.94rem' }}>
              Our supply chain is fully transparent — from the farm to your doorstep, you know exactly where your food comes from.
            </p>
          </div>
          <div style={{ background:'#F8FFF4', borderRadius:'16px', padding:'28px', border:'1px solid #D1FAE5', position:'relative' }}>
            <Quote size={32} color="#D1FAE5" style={{ marginBottom:'12px' }}/>
            <p style={{ fontSize:'1.05rem', lineHeight:1.9, color:'#1B4332', fontFamily:'Playfair Display,serif', fontStyle:'italic', margin:0 }}>
              "Food should be good for you and good for the earth. We built GreenRoots on that one belief — and nothing else."
            </p>
            <div style={{ marginTop:'20px', display:'flex', alignItems:'center', gap:'10px' }}>
              <div style={{ width:'40px', height:'40px', borderRadius:'50%', background:'#2D6A4F', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Sprout size={18} color="white" strokeWidth={1.8}/>
              </div>
              <div>
                <p style={{ fontWeight:700, fontSize:'0.88rem', margin:0 }}>GreenRoots Team</p>
                <p style={{ fontSize:'0.75rem', color:'#6B7280', margin:'2px 0 0' }}>Bangalore, Karnataka</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── How we work ── */}
        <motion.div initial={{ y:20,opacity:0 }} whileInView={{ y:0,opacity:1 }} viewport={{ once:true }} style={{ marginBottom:'72px' }}>
          <h2 style={{ textAlign:'center', fontSize:'clamp(1.4rem,3vw,1.9rem)', marginBottom:'36px' }}>How It Works</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:'16px' }}>
            {[
              { Icon:Sprout,       color:'#4CAF50', bg:'#E8F5E9', step:'01', title:'Farm Sourcing',   desc:'Directly from verified farms across India' },
              { Icon:FlaskConical, color:'#2196F3', bg:'#E3F2FD', step:'02', title:'Quality Check',   desc:'Lab tested for safety and freshness' },
              { Icon:Package,      color:'#8B5CF6', bg:'#EDE9FE', step:'03', title:'Careful Packing', desc:'Eco-friendly packaging to preserve quality' },
              { Icon:Truck,        color:'#F97316', bg:'#FFEDD5', step:'04', title:'Fast Delivery',   desc:'Delivered to cities, towns and villages' },
            ].map(({ Icon,color,bg,step,title,desc }) => (
              <motion.div key={step} whileHover={{ y:-4 }}
                style={{ background:'white', borderRadius:'14px', padding:'24px 18px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', border:'1px solid #F3F4F6', textAlign:'center' }}>
                <div style={{ background:bg, borderRadius:'50%', width:'52px', height:'52px', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
                  <Icon size={24} color={color} strokeWidth={1.8}/>
                </div>
                <p style={{ fontSize:'0.65rem', fontWeight:800, color:color, letterSpacing:'0.1em', textTransform:'uppercase', margin:'0 0 6px' }}>{step}</p>
                <h3 style={{ fontSize:'0.92rem', fontWeight:700, marginBottom:'7px', fontFamily:'Inter,sans-serif' }}>{title}</h3>
                <p style={{ color:'#6B7280', fontSize:'0.82rem', lineHeight:1.7, margin:0 }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Values ── */}
        <motion.div initial={{ y:20,opacity:0 }} whileInView={{ y:0,opacity:1 }} viewport={{ once:true }}>
          <h2 style={{ textAlign:'center', fontSize:'clamp(1.4rem,3vw,1.9rem)', marginBottom:'32px' }}>Our Core Values</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:'16px' }}>
            {VALUES.map(({ Icon,color,bg,title,desc },i) => (
              <motion.div key={title} initial={{ y:20,opacity:0 }} whileInView={{ y:0,opacity:1 }}
                viewport={{ once:true }} transition={{ delay:i*0.1 }} whileHover={{ y:-4 }}
                style={{ background:'white', borderRadius:'14px', padding:'26px', boxShadow:'0 2px 10px rgba(0,0,0,0.05)', border:'1px solid #F3F4F6' }}>
                <div style={{ background:bg, borderRadius:'12px', width:'48px', height:'48px', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'14px' }}>
                  <Icon size={22} color={color} strokeWidth={1.8}/>
                </div>
                <h3 style={{ fontFamily:'Inter,sans-serif', fontWeight:700, fontSize:'0.95rem', marginBottom:'7px' }}>{title}</h3>
                <p style={{ color:'#6B7280', fontSize:'0.84rem', lineHeight:1.7, margin:0 }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── CTA ── */}
        <motion.div initial={{ y:20,opacity:0 }} whileInView={{ y:0,opacity:1 }} viewport={{ once:true }}
          style={{ marginTop:'60px', background:'linear-gradient(135deg,#2D6A4F,#1B4332)', borderRadius:'20px', padding:'clamp(28px,5vw,48px)', textAlign:'center', color:'white' }}>
          <h3 style={{ fontSize:'clamp(1.3rem,3vw,1.8rem)', marginBottom:'10px' }}>Ready to Go Fresh?</h3>
          <p style={{ color:'rgba(255,255,255,0.8)', marginBottom:'22px', fontSize:'0.93rem' }}>
            Join 50,000+ families living healthier with GreenRoots
          </p>
          <Link to="/products" style={{ background:'#74C69D', color:'#1B4332', fontWeight:700, padding:'12px 26px', borderRadius:'9px', fontSize:'0.93rem', textDecoration:'none', display:'inline-flex', alignItems:'center', gap:'7px' }}>
            Start Shopping <ArrowRight size={14}/>
          </Link>
        </motion.div>
      </div>
    </>
  );
};

export default About;
