import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  Carrot, Apple, Milk, Wheat, Bean,
  Flame, Droplets, Coffee, Sparkles, Leaf,
  Zap, Home as HomeIcon, ShoppingBag,
} from 'lucide-react';
import { fetchProducts, fetchCategories } from '../redux/slices/productSlice';
import ProductCard from '../components/product/ProductCard';
import Loader from '../components/common/Loader';

// ── Lucide icon map — every category gets a real icon ─────────
const CATEGORY_META = {
  Vegetables: { Icon: Carrot,    bg: '#E8F5E9', color: '#4CAF50' },
  Fruits:     { Icon: Apple,     bg: '#FCE4EC', color: '#E91E63' },
  Dairy:      { Icon: Milk,      bg: '#E3F2FD', color: '#2196F3' },
  Grains:     { Icon: Wheat,     bg: '#FFF8E1', color: '#F59E0B' },
  Pulses:     { Icon: Bean,      bg: '#F3E5F5', color: '#9C27B0' },
  Spices:     { Icon: Flame,     bg: '#FBE9E7', color: '#FF5722' },
  Oils:       { Icon: Droplets,  bg: '#FFFDE7', color: '#FFC107' },
  Beverages:  { Icon: Coffee,    bg: '#F1F8E9', color: '#8BC34A' },
  Skincare:   { Icon: Sparkles,  bg: '#FCE4EC', color: '#F06292' },
  Electronics:{ Icon: Zap,       bg: '#E3F2FD', color: '#1565C0' },
  Household:  { Icon: HomeIcon,  bg: '#FFF3E0', color: '#E65100' },
  Other:      { Icon: ShoppingBag, bg: '#F3E5F5', color: '#7B1FA2' },
};
const DEFAULT_META = { Icon: Leaf, bg: '#E8F5E9', color: '#4CAF50' };

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading, categories } = useSelector(s => s.product);
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    dispatch(fetchProducts({ featured: true, limit: 8 }));
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => { setFeatured(products); }, [products]);

  return (
    <>
      <Helmet>
        <title>GreenRoots Organics — Pure, Natural, Organic</title>
        <meta name="description" content="Shop fresh organic vegetables, fruits, dairy, electronics and household products. Delivered to your door." />
      </Helmet>

      {/* ── Hero ── */}
      <section style={{ position: 'relative', minHeight: 'clamp(420px,65vh,620px)', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <img
          src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1600&q=85&auto=format&fit=crop"
          alt="Organic farm"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 60%' }}
          loading="eager"
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(100deg, rgba(10,30,18,0.82) 0%, rgba(20,50,30,0.65) 45%, rgba(20,50,30,0.1) 100%)' }}/>

        <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: '60px', paddingBottom: '60px' }}>
          <div style={{ maxWidth: '580px' }}>
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.65 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(116,198,157,0.2)', color: '#74C69D', padding: '6px 14px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 700, border: '1px solid rgba(116,198,157,0.35)', marginBottom: '20px' }}>
                <Leaf size={13} color="#74C69D" strokeWidth={2}/> GreenRoots Organics
              </span>
              <h1 style={{ color: 'white', fontSize: 'clamp(2rem,4.5vw,3.4rem)', lineHeight: 1.15, fontFamily: 'Playfair Display,serif', marginBottom: '16px' }}>
                Nature's Best <br/>Delivered to You
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 'clamp(0.9rem,1.6vw,1.05rem)', lineHeight: 1.85, marginBottom: '28px', maxWidth: '460px' }}>
                From fresh farms directly to your table. No pesticides, no chemicals — just pure goodness your family deserves.
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '36px' }}>
                <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#74C69D', color: '#1B4332', fontWeight: 700, padding: '13px 26px', borderRadius: '9px', fontSize: '0.95rem', textDecoration: 'none', boxShadow: '0 4px 18px rgba(116,198,157,0.3)' }}>
                  Shop Now
                </Link>
                <Link to="/about" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.12)', color: 'white', fontWeight: 600, padding: '13px 22px', borderRadius: '9px', fontSize: '0.95rem', textDecoration: 'none', border: '1.5px solid rgba(255,255,255,0.35)', backdropFilter: 'blur(6px)' }}>
                  Our Story
                </Link>
              </div>
              {/* Stats */}
              <div style={{ display: 'flex', gap: '0', background: 'rgba(0,0,0,0.28)', borderRadius: '12px', overflow: 'hidden', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', width: 'fit-content' }}>
                {[['500+','Products'],['50K+','Customers'],['4.8★','Rating']].map(([num,label],i) => (
                  <div key={label} style={{ padding: '14px 22px', textAlign: 'center', borderRight: i<2 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                    <div style={{ color: '#74C69D', fontWeight: 800, fontSize: 'clamp(1rem,2vw,1.3rem)', fontFamily: 'Playfair Display,serif' }}>{num}</div>
                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.7rem', marginTop: '2px', whiteSpace: 'nowrap' }}>{label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Trust Badges ── */}
      <section style={{ background: 'white', padding: '14px 0', borderBottom: '1px solid #E5E7EB' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 'clamp(14px,3vw,30px)' }}>
          {[
            { Icon: Leaf,       color: '#4CAF50', text: 'Fresh & Natural'     },
            { Icon: Droplets,   color: '#2196F3', text: 'Free Delivery ₹500+' },
            { Icon: Sparkles,   color: '#6366F1', text: 'Secure Payments'     },
            { Icon: Zap,        color: '#FF9800', text: '4.8/5 Rating'         },
          ].map(({ Icon, color, text }) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '0.83rem', fontWeight: 600, color: '#374151' }}>
              <Icon size={15} color={color} strokeWidth={2}/> {text}
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories with Lucide icons ── */}
      <section style={{ padding: 'clamp(40px,6vw,64px) 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: 'clamp(1.5rem,3vw,2.1rem)', color: '#1B1B1B' }}>Shop by Category</h2>
            <p style={{ color: '#6B7280', marginTop: '8px', fontSize: '0.9rem' }}>Explore our wide range of products</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(120px,1fr))', gap: '14px' }}>
            {categories.map((cat, i) => {
              const meta = CATEGORY_META[cat._id] || DEFAULT_META;
              const { Icon, bg, color } = meta;
              return (
                <motion.div key={cat._id}
                  initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}>
                  <Link to={`/products?category=${cat._id}`}
                    style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '20px 10px', background: 'white', borderRadius: '14px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', border: '1.5px solid #F3F4F6', transition: 'all 0.22s', cursor: 'pointer' }}
                    onMouseOver={e => { e.currentTarget.style.borderColor=color; e.currentTarget.style.boxShadow=`0 6px 20px rgba(0,0,0,0.1)`; e.currentTarget.style.transform='translateY(-4px)'; }}
                    onMouseOut={e => { e.currentTarget.style.borderColor='#F3F4F6'; e.currentTarget.style.boxShadow='0 2px 10px rgba(0,0,0,0.06)'; e.currentTarget.style.transform='translateY(0)'; }}>
                    {/* Lucide icon in colored circle */}
                    <div style={{ background: bg, borderRadius: '50%', width: '52px', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={24} color={color} strokeWidth={1.8}/>
                    </div>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1B1B1B', textAlign: 'center', fontFamily: 'Inter,sans-serif' }}>{cat._id}</span>
                    <span style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>{cat.count} items</span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section style={{ padding: 'clamp(32px,5vw,48px) 0', background: 'white' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: 'clamp(1.4rem,3vw,2rem)' }}>Featured Products</h2>
              <p style={{ color: '#6B7280', marginTop: '4px', fontSize: '0.88rem' }}>Hand-picked fresh goodness</p>
            </div>
            <Link to="/products" style={{ color: '#2D6A4F', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', border: '1.5px solid #2D6A4F', padding: '8px 16px', borderRadius: '8px' }}>View All →</Link>
          </div>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><Loader/></div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '18px' }}>
              {featured.map(p => <ProductCard key={p._id} product={p}/>)}
            </div>
          )}
        </div>
      </section>

      {/* ── Why GreenRoots ── */}
      <section style={{ padding: 'clamp(40px,6vw,64px) 0', background: '#F6FAF6' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.4rem,3vw,2rem)', marginBottom: '40px' }}>Why GreenRoots?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '18px' }}>
            {[
              { Icon: Leaf,      color: '#4CAF50', bg: '#E8F5E9', title: 'Farm to Table',  desc: 'Direct sourcing from farms across India — fresh every day' },
              { Icon: Sparkles,  color: '#8B5CF6', bg: '#EDE9FE', title: 'Quality Checked', desc: 'Every product tested before it reaches you' },
              { Icon: Droplets,  color: '#2196F3', bg: '#E3F2FD', title: 'Cold Chain',      desc: 'Temperature controlled delivery to preserve freshness' },
              { Icon: Zap,       color: '#FF9800', bg: '#FFF3E0', title: 'Fast Delivery',   desc: 'Quick delivery across cities, towns and villages' },
            ].map(({ Icon, color, bg, title, desc }) => (
              <motion.div key={title} whileHover={{ y: -5 }}
                style={{ background: 'white', borderRadius: '14px', padding: '26px 20px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', textAlign: 'center', border: '1px solid #F3F4F6' }}>
                <div style={{ background: bg, borderRadius: '50%', width: '54px', height: '54px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                  <Icon size={24} color={color} strokeWidth={1.8}/>
                </div>
                <h3 style={{ fontSize: '0.95rem', fontFamily: 'Inter,sans-serif', fontWeight: 700, marginBottom: '8px' }}>{title}</h3>
                <p style={{ color: '#6B7280', fontSize: '0.83rem', lineHeight: 1.7 }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        <img
          src="https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=1400&q=80&auto=format"
          alt="Fresh vegetables"
          style={{ width: '100%', height: 'clamp(220px,30vw,320px)', objectFit: 'cover', display: 'block' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(27,67,50,0.88),rgba(45,106,79,0.82))', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '32px 20px' }}>
          <h2 style={{ color: 'white', fontSize: 'clamp(1.3rem,3vw,2rem)', marginBottom: '10px', fontFamily: 'Playfair Display,serif' }}>Start Your Journey Today</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '22px', fontSize: 'clamp(0.85rem,1.5vw,0.98rem)' }}>
            Get 10% off your first order · Code: <strong style={{ color: '#74C69D' }}>ORGANIC10</strong>
          </p>
          <Link to="/register" style={{ background: '#74C69D', color: '#1B4332', fontWeight: 700, padding: '13px 28px', borderRadius: '9px', fontSize: '0.95rem', textDecoration: 'none' }}>
            Create Free Account
          </Link>
        </div>
      </section>
    </>
  );
};

export default Home;
