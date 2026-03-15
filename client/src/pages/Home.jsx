import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { fetchProducts, fetchCategories } from '../redux/slices/productSlice';
import ProductCard from '../components/product/ProductCard';
import Loader from '../components/common/Loader';

// ── Professional SVG Category Icons (Flipkart/Amazon style) ──
const CategorySVGs = {
  Vegetables: () => (
    <svg viewBox="0 0 64 64" width="48" height="48">
      <circle cx="32" cy="32" r="30" fill="#E8F5E9"/>
      <path d="M32 14 C22 14 14 22 14 32 C14 42 22 50 32 50 C42 50 50 42 50 32 C50 22 42 14 32 14Z" fill="#4CAF50" opacity="0.2"/>
      <path d="M32 10 C32 10 24 18 24 26 C24 30.4 27.6 34 32 34 C36.4 34 40 30.4 40 26 C40 18 32 10 32 10Z" fill="#2E7D32"/>
      <path d="M32 28 L32 52" stroke="#388E3C" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M24 36 C24 36 28 34 32 36 C36 38 40 36 40 36" stroke="#4CAF50" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M20 44 C20 44 25 41 32 43 C39 45 44 41 44 41" stroke="#4CAF50" strokeWidth="2" fill="none" strokeLinecap="round"/>
    </svg>
  ),
  Fruits: () => (
    <svg viewBox="0 0 64 64" width="48" height="48">
      <circle cx="32" cy="32" r="30" fill="#FCE4EC"/>
      <circle cx="32" cy="36" r="16" fill="#F44336"/>
      <circle cx="32" cy="36" r="16" fill="url(#appleGrad)"/>
      <defs>
        <radialGradient id="appleGrad" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#EF5350"/>
          <stop offset="100%" stopColor="#B71C1C"/>
        </radialGradient>
      </defs>
      <ellipse cx="38" cy="30" rx="4" ry="6" fill="rgba(255,255,255,0.25)" transform="rotate(-20,38,30)"/>
      <path d="M32 20 C32 20 34 14 30 12" stroke="#388E3C" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M30 14 C30 14 24 12 26 8" stroke="#4CAF50" strokeWidth="2" fill="none" strokeLinecap="round"/>
    </svg>
  ),
  Dairy: () => (
    <svg viewBox="0 0 64 64" width="48" height="48">
      <circle cx="32" cy="32" r="30" fill="#E3F2FD"/>
      <rect x="22" y="20" width="20" height="26" rx="4" fill="white" stroke="#90CAF9" strokeWidth="1.5"/>
      <rect x="22" y="20" width="20" height="10" rx="4" fill="#42A5F5"/>
      <path d="M26 16 L28 20 M36 20 L38 16" stroke="#64B5F6" strokeWidth="2" strokeLinecap="round"/>
      <rect x="22" y="26" width="20" height="2" fill="#BBDEFB"/>
      <text x="32" y="40" textAnchor="middle" fontSize="8" fill="#1565C0" fontWeight="bold">MILK</text>
    </svg>
  ),
  Grains: () => (
    <svg viewBox="0 0 64 64" width="48" height="48">
      <circle cx="32" cy="32" r="30" fill="#FFF8E1"/>
      <ellipse cx="32" cy="38" rx="14" ry="10" fill="#FFA726"/>
      <ellipse cx="32" cy="38" rx="14" ry="10" fill="url(#grainGrad)"/>
      <defs>
        <linearGradient id="grainGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFB74D"/>
          <stop offset="100%" stopColor="#E65100"/>
        </linearGradient>
      </defs>
      <path d="M26 38 C26 38 29 42 32 38 C35 34 38 38 38 38" stroke="#BF360C" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M32 38 L32 18" stroke="#388E3C" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M32 24 L27 20 M32 24 L37 20 M32 28 L27 24 M32 28 L37 24" stroke="#4CAF50" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  Pulses: () => (
    <svg viewBox="0 0 64 64" width="48" height="48">
      <circle cx="32" cy="32" r="30" fill="#F3E5F5"/>
      <ellipse cx="26" cy="34" rx="8" ry="6" fill="#8D6E63" transform="rotate(-20,26,34)"/>
      <ellipse cx="38" cy="34" rx="8" ry="6" fill="#795548" transform="rotate(20,38,34)"/>
      <ellipse cx="32" cy="30" rx="8" ry="6" fill="#A1887F"/>
      <ellipse cx="32" cy="30" rx="5" ry="3.5" fill="#D7CCC8"/>
    </svg>
  ),
  Spices: () => (
    <svg viewBox="0 0 64 64" width="48" height="48">
      <circle cx="32" cy="32" r="30" fill="#FBE9E7"/>
      <path d="M36 18 C36 18 44 26 42 36 C40 44 32 46 32 46 C32 46 24 44 22 36 C20 26 28 18 28 18 Z" fill="#FF5722"/>
      <path d="M32 18 L32 14" stroke="#388E3C" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M32 14 C32 14 28 10 30 8" stroke="#4CAF50" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <ellipse cx="30" cy="30" rx="3" ry="5" fill="rgba(255,255,255,0.3)" transform="rotate(-15,30,30)"/>
    </svg>
  ),
  Oils: () => (
    <svg viewBox="0 0 64 64" width="48" height="48">
      <circle cx="32" cy="32" r="30" fill="#FFFDE7"/>
      <rect x="26" y="26" width="12" height="20" rx="3" fill="#FDD835"/>
      <rect x="26" y="26" width="12" height="20" rx="3" fill="url(#oilGrad)"/>
      <defs>
        <linearGradient id="oilGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFEE58"/>
          <stop offset="100%" stopColor="#F9A825"/>
        </linearGradient>
      </defs>
      <rect x="28" y="20" width="8" height="8" rx="2" fill="#FBC02D"/>
      <rect x="30" y="16" width="4" height="6" rx="2" fill="#F57F17"/>
      <ellipse cx="30" cy="34" rx="2" ry="4" fill="rgba(255,255,255,0.3)"/>
    </svg>
  ),
  Beverages: () => (
    <svg viewBox="0 0 64 64" width="48" height="48">
      <circle cx="32" cy="32" r="30" fill="#E8F5E9"/>
      <path d="M24 22 L26 46 Q32 50 38 46 L40 22 Z" fill="#4CAF50"/>
      <path d="M24 22 L26 46 Q32 50 38 46 L40 22 Z" fill="url(#teaGrad)"/>
      <defs>
        <linearGradient id="teaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#66BB6A"/>
          <stop offset="100%" stopColor="#2E7D32"/>
        </linearGradient>
      </defs>
      <path d="M40 28 C40 28 46 28 46 34 C46 40 40 38 40 38" stroke="#A5D6A7" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M24 22 L40 22" stroke="#1B5E20" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M28 16 C28 12 30 10 32 14 C34 10 36 12 36 16" stroke="#4CAF50" strokeWidth="2" fill="none" strokeLinecap="round"/>
    </svg>
  ),
  Skincare: () => (
    <svg viewBox="0 0 64 64" width="48" height="48">
      <circle cx="32" cy="32" r="30" fill="#FCE4EC"/>
      <rect x="24" y="22" width="16" height="24" rx="6" fill="#F48FB1"/>
      <rect x="24" y="22" width="16" height="24" rx="6" fill="url(#skinGrad)"/>
      <defs>
        <linearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F8BBD0"/>
          <stop offset="100%" stopColor="#E91E63"/>
        </linearGradient>
      </defs>
      <rect x="28" y="18" width="8" height="6" rx="2" fill="#F06292"/>
      <rect x="30" y="16" width="4" height="4" rx="1" fill="#E91E63"/>
      <path d="M28 32 Q32 30 36 32 Q32 34 28 32Z" fill="rgba(255,255,255,0.4)"/>
    </svg>
  ),
  Other: () => (
    <svg viewBox="0 0 64 64" width="48" height="48">
      <circle cx="32" cy="32" r="30" fill="#E8F5E9"/>
      <path d="M32 14 C32 14 38 20 38 28 C38 34 35 38 32 40 C29 38 26 34 26 28 C26 20 32 14 32 14Z" fill="#4CAF50"/>
      <path d="M32 40 L32 50" stroke="#388E3C" strokeWidth="3" strokeLinecap="round"/>
      <path d="M32 30 C32 30 26 26 22 28" stroke="#81C784" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M32 30 C32 30 38 26 42 28" stroke="#81C784" strokeWidth="2" fill="none" strokeLinecap="round"/>
    </svg>
  ),
};

// ── Hero illustration — professional organic farm SVG ─────────
const HeroIllustration = () => (
  <svg viewBox="0 0 320 280" width="100%" style={{ maxWidth: '400px' }}>
    {/* Sky */}
    <rect width="320" height="280" rx="20" fill="rgba(255,255,255,0.07)"/>
    {/* Sun */}
    <circle cx="260" cy="50" r="30" fill="rgba(255,220,100,0.3)"/>
    <circle cx="260" cy="50" r="20" fill="rgba(255,220,100,0.6)"/>
    {[0,45,90,135,180,225,270,315].map((angle, i) => (
      <line key={i}
        x1={260 + 25 * Math.cos(angle * Math.PI/180)}
        y1={50  + 25 * Math.sin(angle * Math.PI/180)}
        x2={260 + 38 * Math.cos(angle * Math.PI/180)}
        y2={50  + 38 * Math.sin(angle * Math.PI/180)}
        stroke="rgba(255,220,100,0.5)" strokeWidth="2.5" strokeLinecap="round"/>
    ))}
    {/* Ground */}
    <ellipse cx="160" cy="240" rx="140" ry="20" fill="rgba(0,0,0,0.15)"/>
    <rect x="20" y="200" width="280" height="60" rx="10" fill="#1B4332" opacity="0.4"/>
    {/* Big tree left */}
    <rect x="55" y="140" width="12" height="80" rx="4" fill="#5D4037"/>
    <circle cx="61" cy="125" r="35" fill="#2E7D32"/>
    <circle cx="45" cy="135" r="22" fill="#388E3C"/>
    <circle cx="78" cy="132" r="25" fill="#43A047"/>
    <circle cx="61" cy="110" r="20" fill="#4CAF50"/>
    {/* Small plant middle */}
    <rect x="152" y="190" width="8" height="40" rx="3" fill="#5D4037"/>
    <circle cx="156" cy="178" r="18" fill="#388E3C"/>
    <circle cx="145" cy="185" r="12" fill="#4CAF50"/>
    <circle cx="167" cy="183" r="14" fill="#2E7D32"/>
    {/* Big tree right */}
    <rect x="248" y="150" width="12" height="70" rx="4" fill="#5D4037"/>
    <circle cx="254" cy="135" r="30" fill="#2E7D32"/>
    <circle cx="238" cy="143" r="19" fill="#388E3C"/>
    <circle cx="268" cy="140" r="22" fill="#43A047"/>
    {/* Basket of veggies */}
    <ellipse cx="156" cy="232" rx="30" ry="12" fill="#8D6E63"/>
    <rect x="126" y="218" width="60" height="16" rx="6" fill="#795548"/>
    <circle cx="144" cy="216" r="8" fill="#F44336"/>
    <circle cx="156" cy="212" r="7" fill="#FF9800"/>
    <circle cx="168" cy="215" r="8" fill="#4CAF50"/>
    <ellipse cx="156" cy="215" rx="4" ry="6" fill="#FFEB3B"/>
    {/* Stars/sparkles */}
    {[[80,60],[190,40],[290,120],[30,160]].map(([x,y], i) => (
      <g key={i}>
        <circle cx={x} cy={y} r="2" fill="rgba(255,255,255,0.6)"/>
        <line x1={x-5} y1={y} x2={x+5} y2={y} stroke="rgba(255,255,255,0.4)" strokeWidth="1"/>
        <line x1={x} y1={y-5} x2={x} y2={y+5} stroke="rgba(255,255,255,0.4)" strokeWidth="1"/>
      </g>
    ))}
  </svg>
);

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading, categories } = useSelector(state => state.product);
  const safeProducts   = Array.isArray(products)   ? products   : [];
  const safeCategories = Array.isArray(categories) ? categories : [];

  useEffect(() => {
    dispatch(fetchProducts({ featured: true, limit: 8 }));
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <>
      <Helmet>
        <title>GreenRoots - Pure, Natural, Organic</title>
        <meta name="description" content="Shop certified organic vegetables, fruits, dairy, and more. Farm fresh, delivered to your door." />
      </Helmet>

      {/* ─── Hero ─── */}
      <section style={{ background: 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 60%, #40916C 100%)', padding: 'clamp(40px, 8vw, 80px) 0', overflow: 'hidden' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center' }}>
          <motion.div initial={{ x: -60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.7 }}>
            <span style={{ background: 'rgba(116,198,157,0.25)', color: '#74C69D', padding: '6px 16px', borderRadius: '100px', fontSize: '0.82rem', fontWeight: 700, border: '1px solid rgba(116,198,157,0.4)', display: 'inline-block' }}>
              🌱 100% Certified Organic
            </span>
            <h1 style={{ color: 'white', fontSize: 'clamp(1.8rem, 4vw, 3.2rem)', marginTop: '16px', lineHeight: 1.2, fontFamily: 'Playfair Display, serif' }}>
              Nature's Best,<br />Delivered Fresh
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)', marginTop: '16px', lineHeight: 1.8, maxWidth: '420px' }}>
              From certified organic farms to your table. No pesticides, no chemicals — just pure goodness your family deserves.
            </p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '28px', flexWrap: 'wrap' }}>
              <Link to="/products" style={{ background: '#74C69D', color: '#1B4332', fontWeight: 700, padding: '13px 28px', borderRadius: '8px', fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                Shop Now →
              </Link>
              <Link to="/about" style={{ background: 'transparent', color: 'white', fontWeight: 600, padding: '13px 28px', borderRadius: '8px', fontSize: '0.95rem', border: '1.5px solid rgba(255,255,255,0.5)', display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                Our Story
              </Link>
            </div>
            <div style={{ display: 'flex', gap: 'clamp(16px, 4vw, 32px)', marginTop: '32px', flexWrap: 'wrap' }}>
              {[['500+', 'Products'], ['50K+', 'Customers'], ['100%', 'Organic']].map(([num, label]) => (
                <div key={label}>
                  <div style={{ color: '#74C69D', fontWeight: 700, fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)', fontFamily: 'Playfair Display, serif' }}>{num}</div>
                  <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.78rem', marginTop: '2px' }}>{label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Professional SVG illustration */}
          <motion.div initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.7, delay: 0.2 }}
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            className="hero-illustration">
            <HeroIllustration />
          </motion.div>
        </div>
      </section>

      {/* ─── Trust Badges ─── */}
      <section style={{ background: 'white', padding: '16px 0', borderBottom: '1px solid #E5E7EB' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 'clamp(16px, 3vw, 32px)' }}>
          {[
            ['#4CAF50', '✓', 'Certified Organic'],
            ['#2196F3', '🚚', 'Free Delivery ₹500+'],
            ['#FF9800', '🔒', 'Secure Payments'],
            ['#9C27B0', '↩', '7-Day Returns'],
            ['#F44336', '★', '4.8/5 Rating'],
          ].map(([color, icon, text]) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '0.85rem', fontWeight: 500, color: '#374151' }}>
              <span style={{ color, fontSize: '1rem', fontWeight: 700 }}>{icon}</span>
              {text}
            </div>
          ))}
        </div>
      </section>

      {/* ─── Categories — Flipkart/Amazon style ─── */}
      <section style={{ padding: 'clamp(32px, 6vw, 64px) 0', background: '#F8FFF4' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: '#1B1B1B' }}>Shop by Category</h2>
            <p style={{ color: '#6B7280', marginTop: '6px', fontSize: '0.9rem' }}>Explore our wide range of organic products</p>
          </div>

          {safeCategories.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#9CA3AF', padding: '40px' }}>
              {loading ? <Loader /> : <p>Loading categories...</p>}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '12px' }}>
              {safeCategories.map(cat => {
                const IconComponent = CategorySVGs[cat._id] || CategorySVGs.Other;
                return (
                  <motion.div key={cat._id} whileHover={{ y: -4 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.2 }}>
                    <Link to={`/products?category=${cat._id}`}
                      style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '16px 8px', background: 'white', borderRadius: '12px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', border: '1.5px solid #F3F4F6', transition: 'all 0.2s' }}
                      onMouseOver={e => { e.currentTarget.style.borderColor = '#2D6A4F'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(45,106,79,0.15)'; }}
                      onMouseOut={e => { e.currentTarget.style.borderColor = '#F3F4F6'; e.currentTarget.style.boxShadow = '0 1px 6px rgba(0,0,0,0.06)'; }}>
                      <IconComponent />
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1B1B1B', textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>{cat._id}</span>
                      <span style={{ fontSize: '0.7rem', color: '#9CA3AF', background: '#F3F4F6', padding: '2px 6px', borderRadius: '10px' }}>{cat.count} items</span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ─── Featured Products ─── */}
      <section style={{ padding: 'clamp(32px, 6vw, 48px) 0', background: 'white' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}>Featured Products</h2>
              <p style={{ color: '#6B7280', marginTop: '4px', fontSize: '0.88rem' }}>Hand-picked organic goodness</p>
            </div>
            <Link to="/products" style={{ color: '#2D6A4F', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', border: '1.5px solid #2D6A4F', padding: '8px 16px', borderRadius: '8px' }}>
              View All →
            </Link>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><Loader /></div>
          ) : safeProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF' }}>
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🌿</div>
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

      {/* ─── Why GreenRoots ─── */}
      <section style={{ padding: 'clamp(32px, 6vw, 64px) 0', background: '#F8FFF4' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.4rem, 3vw, 2rem)', marginBottom: '40px' }}>Why GreenRoots?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            {[
              { icon: '🌱', title: 'Farm to Table',  desc: 'Sourced directly from 200+ certified organic farms' },
              { icon: '🔬', title: 'Lab Tested',     desc: 'Every product tested for pesticides and quality' },
              { icon: '❄️', title: 'Cold Chain',     desc: 'Temperature controlled delivery for freshness' },
              { icon: '♻️', title: 'Eco Packaging',  desc: 'Biodegradable packaging for a greener planet' },
            ].map(item => (
              <motion.div key={item.title} whileHover={{ y: -4 }}
                style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', textAlign: 'center', border: '1px solid #F3F4F6' }}>
                <div style={{ fontSize: '2.2rem', marginBottom: '14px' }}>{item.icon}</div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px', fontFamily: 'Inter, sans-serif' }}>{item.title}</h3>
                <p style={{ color: '#6B7280', fontSize: '0.85rem', lineHeight: 1.7 }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section style={{ background: 'linear-gradient(135deg, #2D6A4F, #1B4332)', padding: 'clamp(40px, 8vw, 60px) 20px', textAlign: 'center' }}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }}>
          <h2 style={{ color: 'white', fontSize: 'clamp(1.4rem, 3vw, 2.2rem)', marginBottom: '12px' }}>Start Your Organic Journey Today</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '24px', fontSize: 'clamp(0.9rem, 1.5vw, 1rem)' }}>
            Get 10% off your first order with code: <strong style={{ color: '#74C69D' }}>ORGANIC10</strong>
          </p>
          <Link to="/register" style={{ background: '#74C69D', color: '#1B4332', fontWeight: 700, padding: '14px 32px', borderRadius: '8px', fontSize: '1rem', textDecoration: 'none', display: 'inline-block' }}>
            Create Free Account
          </Link>
        </motion.div>
      </section>

      {/* Responsive styles */}
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
