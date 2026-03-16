import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  Wheat, Carrot, Milk, Apple, Bean,
  Flame, Droplets, Coffee, Sparkles, Leaf,
  BadgeCheck, Truck, Star, RefreshCw, ShieldCheck,
  Sprout, FlaskConical, Thermometer, Recycle,
  ShoppingCart, ArrowRight, MapPin,
} from 'lucide-react';
import { fetchProducts, fetchCategories } from '../redux/slices/productSlice';
import ProductCard from '../components/product/ProductCard';
import Loader from '../components/common/Loader';

// ── Category icon map ─────────────────────────────────────────
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

const TRUST_BADGES = [
  { Icon: BadgeCheck,  color: '#4CAF50', label: 'Certified Organic'   },
  { Icon: Truck,       color: '#2196F3', label: 'Free Delivery ₹500+' },
  { Icon: Star,        color: '#FF9800', label: '4.8/5 Rating'         },
  { Icon: ShieldCheck, color: '#6366F1', label: 'Secure Payments'      },
  { Icon: RefreshCw,   color: '#EC4899', label: '7-Day Returns'        },
];

const WHY_CARDS = [
  { Icon: Sprout,       color: '#4CAF50', bg: '#E8F5E9', title: 'Farm to Table',  desc: 'Direct from 200+ certified organic farms across Karnataka, Tamil Nadu & Maharashtra.' },
  { Icon: FlaskConical, color: '#2196F3', bg: '#E3F2FD', title: 'Lab Tested',     desc: 'Every product tested for pesticides, chemicals and quality before it reaches you.' },
  { Icon: MapPin,       color: '#FF5722', bg: '#FBE9E7', title: 'Remote Delivery', desc: 'We reach villages, hills and forests. If India Post reaches you, we reach you.' },
  { Icon: Recycle,      color: '#8BC34A', bg: '#F1F8E9', title: 'Eco Packaging',  desc: 'Biodegradable packaging. Every order plants a step toward a greener planet.' },
];

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
        <title>GreenRoots Organics — Pure, Natural, Organic</title>
        <meta name="description" content="Shop certified organic vegetables, fruits, dairy and more. Farm fresh delivery to remote areas of India." />
      </Helmet>

      {/* ══ HERO — Professional photo + text overlay ══════════ */}
      <section style={{ position: 'relative', minHeight: 'clamp(420px, 70vh, 640px)', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
        {/* Background farm photo from Unsplash */}
        <img
          src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1600&q=85&auto=format"
          alt="Organic farm"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
        />
        {/* Dark gradient overlay — left side darker for text readability */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(15,36,25,0.92) 0%, rgba(27,67,50,0.78) 50%, rgba(27,67,50,0.3) 100%)' }}/>

        {/* Content */}
        <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: '60px', paddingBottom: '60px' }}>
          <div style={{ maxWidth: '600px' }}>
            <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
              {/* Badge */}
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(116,198,157,0.2)', color: '#74C69D', padding: '7px 16px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 700, border: '1px solid rgba(116,198,157,0.4)', marginBottom: '20px' }}>
                <BadgeCheck size={13} strokeWidth={2.5}/> 100% Certified Organic · Bangalore
              </span>

              <h1 style={{ color: 'white', fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', lineHeight: 1.15, fontFamily: 'Playfair Display, serif', marginBottom: '18px' }}>
                Farm Fresh Organics<br/>
                <span style={{ color: '#74C69D' }}>Delivered Everywhere</span>
              </h1>

              <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 'clamp(0.9rem, 1.6vw, 1.08rem)', lineHeight: 1.8, marginBottom: '28px', maxWidth: '480px' }}>
                From certified organic farms across Karnataka to your table — cities, towns, and remote villages. No pesticides, no chemicals, just pure goodness your family deserves.
              </p>

              {/* USP pills */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '32px' }}>
                {[
                  { Icon: MapPin,   text: 'Remote Delivery' },
                  { Icon: Sprout,   text: 'Organic Certified' },
                  { Icon: Truck,    text: 'Free on ₹500+' },
                ].map(({ Icon, text }) => (
                  <span key={text} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'rgba(255,255,255,0.12)', color: 'white', padding: '6px 12px', borderRadius: '100px', fontSize: '0.78rem', fontWeight: 600, border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)' }}>
                    <Icon size={12} color="#74C69D" strokeWidth={2.5}/> {text}
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#74C69D', color: '#1B4332', padding: '14px 28px', borderRadius: '10px', fontWeight: 800, fontSize: '0.95rem', textDecoration: 'none', boxShadow: '0 4px 20px rgba(116,198,157,0.35)', transition: 'transform 0.2s' }}
                  onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  <ShoppingCart size={16} strokeWidth={2.5}/> Shop Now
                </Link>
                <Link to="/about" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', color: 'white', padding: '14px 24px', borderRadius: '10px', fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none', border: '1.5px solid rgba(255,255,255,0.35)', backdropFilter: 'blur(4px)' }}>
                  Our Story <ArrowRight size={14}/>
                </Link>
              </div>
            </motion.div>

            {/* Stats row */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.6 }}
              style={{ display: 'flex', gap: '0', marginTop: '48px', background: 'rgba(0,0,0,0.3)', borderRadius: '14px', overflow: 'hidden', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', width: 'fit-content' }}>
              {[['500+','Products'],['200+','Partner Farms'],['50K+','Happy Families'],['100%','Organic']].map(([num, label], i) => (
                <div key={label} style={{ padding: '16px 24px', textAlign: 'center', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                  <div style={{ color: '#74C69D', fontWeight: 800, fontSize: 'clamp(1.1rem,2vw,1.4rem)', fontFamily: 'Playfair Display,serif' }}>{num}</div>
                  <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.72rem', marginTop: '2px', whiteSpace: 'nowrap' }}>{label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══ TRUST BADGES ════════════════════════════════════ */}
      <section style={{ background: 'white', padding: '14px 0', borderBottom: '1px solid #E5E7EB' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 'clamp(14px,3vw,32px)' }}>
          {TRUST_BADGES.map(({ Icon, color, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '0.83rem', fontWeight: 600, color: '#374151' }}>
              <Icon size={16} color={color} strokeWidth={2.2}/> {label}
            </div>
          ))}
        </div>
      </section>

      {/* ══ REMOTE DELIVERY BANNER ══════════════════════════ */}
      <section style={{ background: 'linear-gradient(135deg,#1B4332,#2D6A4F)', padding: '0' }}>
        <div className="container" style={{ padding: '20px 20px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ background: 'rgba(116,198,157,0.2)', borderRadius: '10px', padding: '10px', flexShrink: 0 }}>
              <MapPin size={20} color="#74C69D"/>
            </div>
            <div>
              <p style={{ color: 'white', fontWeight: 700, fontSize: '0.95rem', margin: 0 }}>
                We deliver to <span style={{ color: '#74C69D' }}>remote areas</span> across India
              </p>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.8rem', margin: '3px 0 0' }}>
                Villages · Hill stations · Forest areas · Tribal regions — wherever India Post reaches, we reach
              </p>
            </div>
          </div>
          <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#74C69D', color: '#1B4332', padding: '10px 20px', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none', whiteSpace: 'nowrap' }}>
            Order Now <ArrowRight size={13}/>
          </Link>
        </div>
      </section>

      {/* ══ CATEGORIES ══════════════════════════════════════ */}
      <section style={{ textAlign: 'center', padding: 'clamp(32px,6vw,60px) 0', background: '#F6FAF6' }}>
        <div className="container">
          <h2 style={{ fontSize: 'clamp(1.4rem,3vw,2rem)', color: '#1B1B1B', marginBottom: '6px' }}>Shop by Category</h2>
          <p style={{ color: '#6B7280', fontSize: '0.88rem', marginBottom: '32px' }}>Explore our wide range of organic products</p>

          {safeCategories.length === 0 ? (
            <div style={{ padding: '40px', color: '#9CA3AF' }}>{loading ? <Loader/> : <p>Loading categories...</p>}</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(110px,1fr))', gap: '12px' }}>
              {safeCategories.map((cat, i) => {
                const { Icon, bg, color } = CATEGORY_META[cat._id] || DEFAULT_META;
                return (
                  <motion.div key={cat._id}
                    initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: i * 0.06, duration: 0.3 }}>
                    <Link to={`/products?category=${cat._id}`}
                      style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '20px 8px', background: 'white', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1.5px solid #F3F4F6', cursor: 'pointer', transition: 'all 0.25s ease' }}
                      onMouseOver={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.10)'; }}
                      onMouseOut={e => { e.currentTarget.style.borderColor = '#F3F4F6'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)'; }}>
                      <div style={{ background: bg, borderRadius: '50%', width: '52px', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon size={24} color={color} strokeWidth={1.8}/>
                      </div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1B1B1B', fontFamily: 'Inter,sans-serif', textAlign: 'center' }}>{cat._id}</span>
                      <span style={{ fontSize: '0.68rem', color: '#9CA3AF', background: '#F3F4F6', padding: '2px 7px', borderRadius: '10px' }}>{cat.count} items</span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ══ FEATURED PRODUCTS ═══════════════════════════════ */}
      <section style={{ padding: 'clamp(32px,6vw,48px) 0', background: 'white' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: 'clamp(1.4rem,3vw,2rem)' }}>Featured Products</h2>
              <p style={{ color: '#6B7280', marginTop: '4px', fontSize: '0.87rem' }}>Hand-picked from our best organic collection</p>
            </div>
            <Link to="/products" style={{ color: '#2D6A4F', fontWeight: 700, fontSize: '0.88rem', textDecoration: 'none', border: '1.5px solid #2D6A4F', padding: '8px 16px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              View All <ArrowRight size={14}/>
            </Link>
          </div>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><Loader/></div>
          ) : safeProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF' }}>
              <Leaf size={48} color="#D1FAE5" style={{ margin: '0 auto 12px' }}/>
              <p style={{ marginBottom: '16px' }}>Products loading...</p>
              <button onClick={() => { dispatch(fetchProducts({ featured: true, limit: 8 })); dispatch(fetchCategories()); }}
                style={{ padding: '10px 24px', background: '#2D6A4F', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontWeight: 600 }}>Retry</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '16px' }}>
              {safeProducts.map(p => <ProductCard key={p._id} product={p}/>)}
            </div>
          )}
        </div>
      </section>

      {/* ══ WHY GREENROOTS ══════════════════════════════════ */}
      <section style={{ padding: 'clamp(32px,6vw,60px) 0', background: '#F6FAF6' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.4rem,3vw,2rem)', marginBottom: '36px' }}>Why GreenRoots?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '18px' }}>
            {WHY_CARDS.map(({ Icon, color, bg, title, desc }) => (
              <motion.div key={title} whileHover={{ y: -4 }}
                style={{ background: 'white', borderRadius: '14px', padding: '28px 22px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', textAlign: 'center', border: '1px solid #F3F4F6' }}>
                <div style={{ background: bg, borderRadius: '50%', width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Icon size={26} color={color} strokeWidth={1.8}/>
                </div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '8px', fontFamily: 'Inter,sans-serif' }}>{title}</h3>
                <p style={{ color: '#6B7280', fontSize: '0.83rem', lineHeight: 1.7 }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ═════════════════════════════════════════════ */}
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        <img
          src="https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=1400&q=80&auto=format"
          alt="Organic vegetables"
          style={{ width: '100%', height: 'clamp(240px,35vw,340px)', objectFit: 'cover', display: 'block' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(27,67,50,0.9),rgba(45,106,79,0.85))', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '32px 20px' }}>
          <motion.div initial={{ scale: 0.92, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }}>
            <h2 style={{ color: 'white', fontSize: 'clamp(1.4rem,3vw,2.2rem)', marginBottom: '12px', fontFamily: 'Playfair Display,serif' }}>Start Your Organic Journey Today</h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '24px', fontSize: 'clamp(0.88rem,1.5vw,1rem)' }}>
              First order 10% off · Code: <strong style={{ color: '#74C69D' }}>ORGANIC10</strong>
            </p>
            <Link to="/register" style={{ background: '#74C69D', color: '#1B4332', fontWeight: 700, padding: '14px 32px', borderRadius: '10px', fontSize: '0.95rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 20px rgba(116,198,157,0.3)' }}>
              Create Free Account <ArrowRight size={15}/>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Home;
