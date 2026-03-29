import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { fetchProducts, fetchCategories } from '../redux/slices/productSlice';
import ProductCard from '../components/product/ProductCard';
import Loader from '../components/common/Loader';

const CATEGORY_ICONS = {
  Vegetables: '🥦', Fruits: '🍎', Dairy: '🥛', Grains: '🌾',
  Pulses: '🫘', Spices: '🌶️', Oils: '🫙', Beverages: '🍵',
  Skincare: '🌹', Other: '🌿',
};

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading, categories } = useSelector(s => s.product);
  const [featured, setFeatured] = useState([]);

  useEffect(() => { dispatch(fetchProducts({ featured: true, limit: 8 })); dispatch(fetchCategories()); }, [dispatch]);
  useEffect(() => { setFeatured(products); }, [products]);

  return (
    <>
      <Helmet>
        <title>GreenRoots Organics — Pure, Natural, Organic</title>
        <meta name="description" content="Shop fresh organic vegetables, fruits, dairy and more. Delivered to your door." />
      </Helmet>

      {/* ── Hero — full-width farm photo with transparent overlay ── */}
      <section style={{ position: 'relative', minHeight: 'clamp(420px,65vh,620px)', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        {/* Background photo */}
        <img
          src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1600&q=85&auto=format&fit=crop"
          alt="Organic farm"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 60%' }}
          loading="eager"
        />
        {/* Transparent dark gradient — left denser for text, right clears */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(100deg, rgba(10,30,18,0.82) 0%, rgba(20,50,30,0.65) 45%, rgba(20,50,30,0.1) 100%)' }}/>

        <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: '60px', paddingBottom: '60px' }}>
          <div style={{ maxWidth: '580px' }}>
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.65 }}>
              {/* Small pill */}
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(116,198,157,0.2)', color: '#74C69D', padding: '6px 14px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 700, border: '1px solid rgba(116,198,157,0.35)', marginBottom: '20px' }}>
                🌿 GreenRoots Organics
              </span>

              <h1 style={{ color: 'white', fontSize: 'clamp(2rem,4.5vw,3.4rem)', lineHeight: 1.15, fontFamily: 'Playfair Display,serif', marginBottom: '16px' }}>
                Nature's Best,<br/>Delivered to You
              </h1>

              <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 'clamp(0.9rem,1.6vw,1.05rem)', lineHeight: 1.85, marginBottom: '28px', maxWidth: '460px' }}>
                From fresh farms directly to your table. No pesticides, no chemicals — just pure goodness your family deserves.
              </p>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '36px' }}>
                <Link to="/products"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#74C69D', color: '#1B4332', fontWeight: 700, padding: '13px 26px', borderRadius: '9px', fontSize: '0.95rem', textDecoration: 'none', boxShadow: '0 4px 18px rgba(116,198,157,0.3)' }}>
                  🛒 Shop Now
                </Link>
                <Link to="/about"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.12)', color: 'white', fontWeight: 600, padding: '13px 22px', borderRadius: '9px', fontSize: '0.95rem', textDecoration: 'none', border: '1.5px solid rgba(255,255,255,0.35)', backdropFilter: 'blur(6px)' }}>
                  Our Story
                </Link>
              </div>

              {/* Stats — frosted glass cards */}
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
      <section style={{ background: 'white', padding: '16px 0', borderBottom: '1px solid #E5E7EB' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 'clamp(14px,3vw,32px)' }}>
          {[['🚚','Free Delivery ₹500+'],['🔒','Secure Payments'],['↩️','7-Day Returns'],['⭐','4.8/5 Rating'],['🌿','Fresh & Natural']].map(([icon, text]) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '0.85rem', fontWeight: 500, color: '#374151' }}>
              <span style={{ fontSize: '1.1rem' }}>{icon}</span>{text}
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories ── */}
      <section style={{ padding: 'clamp(40px,6vw,64px) 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <h2 style={{ fontSize: 'clamp(1.5rem,3vw,2.1rem)', color: '#1B1B1B' }}>Shop by Category</h2>
            <p style={{ color: '#6B7280', marginTop: '8px', fontSize: '0.9rem' }}>Explore our wide range of products</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(120px,1fr))', gap: '14px' }}>
            {categories.map(cat => (
              <motion.div key={cat._id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to={`/products?category=${cat._id}`}
                  style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '20px 10px', background: 'white', borderRadius: '14px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6', transition: 'all 0.2s' }}
                  onMouseOver={e => { e.currentTarget.style.borderColor='#2D6A4F'; e.currentTarget.style.boxShadow='0 6px 18px rgba(0,0,0,0.1)'; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor='#F3F4F6'; e.currentTarget.style.boxShadow='0 2px 10px rgba(0,0,0,0.06)'; }}>
                  <span style={{ fontSize: '2rem' }}>{CATEGORY_ICONS[cat._id] || '🌿'}</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', textAlign: 'center' }}>{cat._id}</span>
                  <span style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>{cat.count} items</span>
                </Link>
              </motion.div>
            ))}
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '20px' }}>
            {[
              { icon: '🌱', title: 'Farm to Table',   desc: 'Direct sourcing from farms across India — fresh every day' },
              { icon: '🔬', title: 'Lab Tested',      desc: 'Every product tested for pesticide residues and quality' },
              { icon: '❄️', title: 'Cold Chain',      desc: 'Temperature controlled delivery to preserve freshness' },
              { icon: '♻️', title: 'Eco Packaging',   desc: 'Biodegradable packaging for a greener planet' },
            ].map(item => (
              <motion.div key={item.title} whileHover={{ y: -5 }}
                style={{ background: 'white', borderRadius: '14px', padding: '26px 20px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', textAlign: 'center', border: '1px solid #F3F4F6' }}>
                <div style={{ fontSize: '2.2rem', marginBottom: '14px' }}>{item.icon}</div>
                <h3 style={{ fontSize: '0.98rem', fontFamily: 'Inter,sans-serif', fontWeight: 700, marginBottom: '8px' }}>{item.title}</h3>
                <p style={{ color: '#6B7280', fontSize: '0.85rem', lineHeight: 1.7 }}>{item.desc}</p>
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

      {/* Mobile hero responsiveness */}
      <style>{`
        @media (max-width: 600px) {
          .container > div[style*="maxWidth: '580px'"] { max-width: 100% !important; }
        }
      `}</style>
    </>
  );
};

export default Home;
