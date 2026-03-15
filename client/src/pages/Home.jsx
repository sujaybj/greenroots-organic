import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  Wheat, Carrot, Milk, Apple, Bean,
  Flame, Droplets, Coffee, Sparkles, Leaf,
  ShoppingCart, CheckCircle, Truck, RotateCcw, Star,
} from 'lucide-react';
import { fetchProducts, fetchCategories } from '../redux/slices/productSlice';
import ProductCard from '../components/product/ProductCard';
import Loader from '../components/common/Loader';

// ── Lucide icon map per category ─────────────────────────────
const CATEGORY_META = {
  Grains:     { Icon: Wheat,    bg: '#FFF8E1', color: '#F59E0B' },
  Vegetables: { Icon: Carrot,   bg: '#E8F5E9', color: '#4CAF50' },
  Dairy:      { Icon: Milk,     bg: '#E3F2FD', color: '#2196F3' },
  Fruits:     { Icon: Apple,    bg: '#FCE4EC', color: '#E91E63' },
  Pulses:     { Icon: Bean,     bg: '#F3E5F5', color: '#9C27B0' },
  Spices:     { Icon: Flame,    bg: '#FBE9E7', color: '#FF5722' },
  Oils:       { Icon: Droplets, bg: '#FFFDE7', color: '#FFC107' },
  Beverages:  { Icon: Coffee,   bg: '#F1F8E9', color: '#8BC34A' },
  Skincare:   { Icon: Sparkles, bg: '#FCE4EC', color: '#F06292' },
  Other:      { Icon: Leaf,     bg: '#E8F5E9', color: '#4CAF50' },
};

const DEFAULT_META = { Icon: Leaf, bg: '#E8F5E9', color: '#4CAF50' };

// ── Hero Farm Illustration ────────────────────────────────────
const HeroIllustration = () => (
  <svg viewBox="0 0 320 280" width="100%" style={{ maxWidth: '420px' }}>
    <rect width="320" height="280" rx="20" fill="rgba(255,255,255,0.07)"/>
    <circle cx="260" cy="50" r="30" fill="rgba(255,220,100,0.25)"/>
    <circle cx="260" cy="50" r="20" fill="rgba(255,220,100,0.55)"/>
    {[0,45,90,135,180,225,270,315].map((a, i) => (
      <line key={i}
        x1={260 + 25*Math.cos(a*Math.PI/180)} y1={50 + 25*Math.sin(a*Math.PI/180)}
        x2={260 + 38*Math.cos(a*Math.PI/180)} y2={50 + 38*Math.sin(a*Math.PI/180)}
        stroke="rgba(255,220,100,0.5)" strokeWidth="2.5" strokeLinecap="round"/>
    ))}
    <rect x="20" y="210" width="280" height="50" rx="8" fill="rgba(0,0,0,0.2)"/>
    <rect x="48" y="148" width="12" height="74" rx="4" fill="#5D4037"/>
    <circle cx="54" cy="130" r="32" fill="#2E7D32"/>
    <circle cx="38" cy="140" r="20" fill="#388E3C"/>
    <circle cx="70" cy="138" r="24" fill="#43A047"/>
    <circle cx="54" cy="116" r="18" fill="#4CAF50"/>
    <rect x="152" y="192" width="8" height="38" rx="3" fill="#5D4037"/>
    <circle cx="156" cy="180" r="17" fill="#388E3C"/>
    <circle cx="145" cy="187" r="11" fill="#4CAF50"/>
    <circle cx="167" cy="185" r="13" fill="#2E7D32"/>
    <rect x="242" y="158" width="12" height="62" rx="4" fill="#5D4037"/>
    <circle cx="248" cy="142" r="27" fill="#2E7D32"/>
    <circle cx="233" cy="150" r="17" fill="#388E3C"/>
    <circle cx="262" cy="148" r="20" fill="#43A047"/>
    <ellipse cx="156" cy="234" rx="28" ry="11" fill="#8D6E63"/>
    <rect x="128" y="221" width="56" height="15" rx="5" fill="#795548"/>
    <circle cx="143" cy="219" r="7" fill="#F44336"/>
    <circle cx="156" cy="215" r="6" fill="#FF9800"/>
    <circle cx="169" cy="218" r="7" fill="#4CAF50"/>
    {[[80,60],[190,40],[295,115],[30,162]].map(([x,y],i)=>(
      <g key={i}>
        <circle cx={x} cy={y} r="2" fill="rgba(255,255,255,0.5)"/>
        <line x1={x-5} y1={y} x2={x+5} y2={y} stroke="rgba(255,255,255,0.35)" strokeWidth="1"/>
        <line x1={x} y1={y-5} x2={x} y2={y+5} stroke="rgba(255,255,255,0.35)" strokeWidth="1"/>
      </g>
    ))}
  </svg>
);

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading, categories } = useSelector(s => s.product);
  const safeProducts   = Array.isArray(products)   ? products   : [];
  const safeCategories = Array.isArray(categories) ? categories : [];

  useEffect(() => {
    dispatch(fetchProducts({ featured: true, limit: 8 }));
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <>
      <Helmet>
        <title>GreenRoots Organics - Pure, Natural, Organic</title>
        <meta name="description" content="Shop certified organic vegetables, fruits, dairy and more. Farm fresh, delivered to your door." />
      </Helmet>

      {/* ═══ HERO ════════════════════════════════════════════ */}
      <section style={{ background: 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 55%, #40916C 100%)', padding: 'clamp(40px, 8vw, 80px) 0', overflow: 'hidden' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center' }}>
          <motion.div initial={{ x: -60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.7 }}>
            <span style={{ background: 'rgba(116,198,157,0.25)', color: '#74C69D', padding: '6px 16px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 700, border: '1px solid rgba(116,198,157,0.4)', display: 'inline-block' }}>
              🌱 100% Certified Organic
            </span>
            <h1 style={{ color: 'white', fontSize: 'clamp(1.8rem, 4vw, 3.2rem)', marginTop: '16px', lineHeight: 1.2, fontFamily: 'Playfair Display, serif' }}>
              Nature's Best,<br />Delivered Fresh
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 'clamp(0.88rem, 1.5vw, 1.05rem)', marginTop: '16px', lineHeight: 1.8, maxWidth: '420px' }}>
              From certified organic farms to your table. No pesticides, no chemicals — just pure goodness your family deserves.
            </p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '28px', flexWrap: 'wrap' }}>
              <Link to="/products" style={{ background: '#74C69D', color: '#1B4332', fontWeight: 700, padding: '13px 28px', borderRadius: '8px', fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                <ShoppingCart size={17} /> Shop Now
              </Link>
              <Link to="/about" style={{ background: 'transparent', color: 'white', fontWeight: 600, padding: '13px 28px', borderRadius: '8px', fontSize: '0.95rem', border: '1.5px solid rgba(255,255,255,0.45)', display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                Our Story
              </Link>
            </div>
            <div style={{ display: 'flex', gap: 'clamp(16px, 4vw, 32px)', marginTop: '32px', flexWrap: 'wrap' }}>
              {[['500+', 'Products'], ['50K+', 'Customers'], ['100%', 'Organic']].map(([num, label]) => (
                <div key={label}>
                  <div style={{ color: '#74C69D', fontWeight: 700, fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)', fontFamily: 'Playfair Display, serif' }}>{num}</div>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', marginTop: '2px' }}>{label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div className="hero-illustration"
            initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.7, delay: 0.2 }}
            style={{ display: 'flex', justifyContent: 'center' }}>
            <HeroIllustration />
          </motion.div>
        </div>
      </section>

      {/* ═══ TRUST BADGES ══════════════════════════════════════ */}
      <section style={{ background: 'white', padding: '14px 0', borderBottom: '1px solid #E5E7EB' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 'clamp(14px, 3vw, 32px)' }}>
          {[
            [CheckCircle, '#4CAF50', 'Certified Organic'],
            [Truck,        '#2196F3', 'Free Delivery ₹500+'],
            [Star,         '#FF9800', '4.8/5 Rating'],
            [RotateCcw,    '#9C27B0', '7-Day Returns'],
          ].map(([Icon, color, text]) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '0.84rem', fontWeight: 500, color: '#374151' }}>
              <Icon size={16} color={color} strokeWidth={2} />
              {text}
            </div>
          ))}
        </div>
      </section>

      {/* ═══ CATEGORIES — Blinkit / Amazon Style ══════════════ */}
      <section style={{ textAlign: 'center', padding: 'clamp(32px,6vw,60px) 0', background: '#F6FAF6' }}>
        <div className="container">
          <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: '#1B1B1B', marginBottom: '6px' }}>Shop by Category</h2>
          <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: '32px' }}>Explore our wide range of organic products</p>

          {safeCategories.length === 0 ? (
            <div style={{ padding: '40px', color: '#9CA3AF' }}>
              {loading ? <Loader /> : <p>Loading categories...</p>}
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '16px',
              marginTop: '8px',
            }}>
              {safeCategories.map((cat, i) => {
                const meta = CATEGORY_META[cat._id] || DEFAULT_META;
                const { Icon, bg, color } = meta;
                return (
                  <motion.div key={cat._id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: i * 0.06, duration: 0.3 }}
                    whileHover={{ translateY: -6, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                    <Link to={`/products?category=${cat._id}`}
                      style={{
                        textDecoration: 'none',
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', gap: '10px',
                        padding: '22px 12px',
                        background: 'white',
                        borderRadius: '16px',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                        border: '1px solid #F3F4F6',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseOver={e => { e.currentTarget.style.borderColor = color; }}
                      onMouseOut={e => { e.currentTarget.style.borderColor = '#F3F4F6'; }}>
                      {/* Icon circle — Amazon/Blinkit style */}
                      <div style={{
                        background: bg,
                        borderRadius: '50%',
                        width: '56px', height: '56px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'transform 0.3s',
                      }}>
                        <Icon size={26} color={color} strokeWidth={1.8} />
                      </div>
                      <h4 style={{ margin: '4px 0 0', fontSize: '0.85rem', fontWeight: 700, color: '#1B1B1B', fontFamily: 'Inter, sans-serif' }}>
                        {cat._id}
                      </h4>
                      <span style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>
                        {cat.count} {cat.count === 1 ? 'item' : 'items'}
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ═══ FEATURED PRODUCTS ══════════════════════════════════ */}
      <section style={{ padding: 'clamp(32px, 6vw, 48px) 0', background: 'white' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}>Featured Products</h2>
              <p style={{ color: '#6B7280', marginTop: '4px', fontSize: '0.88rem' }}>Hand-picked organic goodness</p>
            </div>
            <Link to="/products" style={{ color: '#2D6A4F', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', border: '1.5px solid #2D6A4F', padding: '8px 16px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              View All →
            </Link>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><Loader /></div>
          ) : safeProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF' }}>
              <Leaf size={48} color="#D1FAE5" style={{ marginBottom: '12px' }} />
              <p style={{ marginBottom: '16px' }}>Products loading...</p>
              <button onClick={() => { dispatch(fetchProducts({ featured: true, limit: 8 })); dispatch(fetchCategories()); }}
                style={{ padding: '10px 24px', background: '#2D6A4F', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                Retry
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
              {safeProducts.map(product => <ProductCard key={product._id} product={product} />)}
            </div>
          )}
        </div>
      </section>

      {/* ═══ WHY GREENROOTS ═════════════════════════════════════ */}
      <section style={{ padding: 'clamp(32px, 6vw, 60px) 0', background: '#F6FAF6' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.4rem, 3vw, 2rem)', marginBottom: '36px' }}>Why GreenRoots?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '18px' }}>
            {[
              { icon: '🌱', title: 'Farm to Table',  desc: 'Sourced directly from 200+ certified organic farms' },
              { icon: '🔬', title: 'Lab Tested',     desc: 'Every product tested for pesticides and quality' },
              { icon: '❄️', title: 'Cold Chain',     desc: 'Temperature controlled delivery for freshness' },
              { icon: '♻️', title: 'Eco Packaging',  desc: 'Biodegradable packaging for a greener planet' },
            ].map(item => (
              <motion.div key={item.title} whileHover={{ y: -4 }}
                style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', textAlign: 'center', border: '1px solid #F3F4F6' }}>
                <div style={{ fontSize: '2.2rem', marginBottom: '12px' }}>{item.icon}</div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '8px', fontFamily: 'Inter, sans-serif' }}>{item.title}</h3>
                <p style={{ color: '#6B7280', fontSize: '0.83rem', lineHeight: 1.7 }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ════════════════════════════════════════════════ */}
      <section style={{ background: 'linear-gradient(135deg, #2D6A4F, #1B4332)', padding: 'clamp(40px,8vw,60px) 20px', textAlign: 'center' }}>
        <motion.div initial={{ scale: 0.92, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }}>
          <h2 style={{ color: 'white', fontSize: 'clamp(1.4rem, 3vw, 2.2rem)', marginBottom: '12px' }}>
            Start Your Organic Journey Today
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '24px', fontSize: 'clamp(0.88rem, 1.5vw, 1rem)' }}>
            Get 10% off your first order with code: <strong style={{ color: '#74C69D' }}>ORGANIC10</strong>
          </p>
          <Link to="/register" style={{ background: '#74C69D', color: '#1B4332', fontWeight: 700, padding: '14px 32px', borderRadius: '8px', fontSize: '1rem', textDecoration: 'none', display: 'inline-block' }}>
            Create Free Account
          </Link>
        </motion.div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .hero-illustration { display: none !important; }
          .container > div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
};

export default Home;
