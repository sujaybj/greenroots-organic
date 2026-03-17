import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { fetchProducts, fetchCategories } from '../redux/slices/productSlice';
import ProductCard from '../components/product/ProductCard';
import Loader from '../components/common/Loader';

const CATEGORY_ICONS = { Vegetables: '🥦', Fruits: '🍎', Dairy: '🥛', Grains: '🌾', Pulses: '🫘', Spices: '🌶️', Oils: '🫙', Beverages: '🍵', Skincare: '🌹', Other: '🌿' };

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading, categories } = useSelector(state => state.product);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    dispatch(fetchProducts({ featured: true, limit: 8 }));
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    setFeaturedProducts(products);
  }, [products]);

  return (
    <>
      <Helmet>
        <title>GreenRoots Organics - Pure, Natural, Organic</title>
        <meta name="description" content="Shop certified organic vegetables, fruits, dairy, and more. Farm fresh, delivered to your door." />
      </Helmet>

      {/* ─── Hero Section ─── */}
      <section style={{ background: 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 60%, #40916C 100%)', padding: '80px 0', overflow: 'hidden', position: 'relative' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center' }}>
          <motion.div initial={{ x: -60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.7 }}>
            <span style={{ background: 'rgba(116,198,157,0.3)', color: '#74C69D', padding: '6px 16px', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 600 }}>🌿 GreenRoots Organics</span>
            <h1 style={{ color: 'white', fontSize: 'clamp(2rem, 4vw, 3.2rem)', marginTop: '16px', lineHeight: 1.2, fontFamily: 'Playfair Display, serif' }}>
              Nature's Best,<br />Delivered Fresh
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.05rem', marginTop: '16px', lineHeight: 1.8, maxWidth: '420px' }}>
              From certified organic farms to your table. No pesticides, no chemicals — just pure goodness your family deserves.
            </p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '32px', flexWrap: 'wrap' }}>
              <Link to="/products" className="btn" style={{ background: '#74C69D', color: '#1B4332', fontWeight: 700, padding: '14px 28px' }}>Shop Now 🛒</Link>
              <Link to="/about" className="btn btn-outline" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}>Our Story</Link>
            </div>
            <div style={{ display: 'flex', gap: '32px', marginTop: '32px' }}>
              {[['500+', 'Products'], ['50K+', 'Happy Customers'], ['4.8★', 'Rating']].map(([num, label]) => (
                <div key={label}>
                  <div style={{ color: '#74C69D', fontWeight: 700, fontSize: '1.4rem', fontFamily: 'Playfair Display, serif' }}>{num}</div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', marginTop: '2px' }}>{label}</div>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.7, delay: 0.2 }}
            style={{ display: 'flex', justifyContent: 'center', fontSize: '180px', lineHeight: 1 }}>
            🥬
          </motion.div>
        </div>
      </section>

      {/* ─── Trust Badges ─── */}
      <section style={{ background: 'white', padding: '20px 0', borderBottom: '1px solid #E5E7EB' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '32px' }}>
          {[['🌿', 'Certified Organic'], ['🚚', 'Free Delivery ₹500+'], ['🔒', 'Secure Payments'], ['↩️', '7-Day Returns'], ['⭐', '4.8/5 Rating']].map(([icon, text]) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 500, color: '#374151' }}>
              <span style={{ fontSize: '1.2rem' }}>{icon}</span>{text}
            </div>
          ))}
        </div>
      </section>

      {/* ─── Categories ─── */}
      <section style={{ padding: '64px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', color: '#1B1B1B' }}>Shop by Category</h2>
            <p style={{ color: '#6B7280', marginTop: '8px' }}>Explore our wide range of organic products</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '16px' }}>
            {categories.map(cat => (
              <motion.div key={cat._id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to={`/products?category=${cat._id}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '20px 12px', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6', transition: 'all 0.2s' }}
                  onMouseOver={e => e.currentTarget.style.borderColor = '#2D6A4F'}
                  onMouseOut={e => e.currentTarget.style.borderColor = '#F3F4F6'}>
                  <span style={{ fontSize: '2rem' }}>{CATEGORY_ICONS[cat._id] || '🌿'}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151', textAlign: 'center' }}>{cat._id}</span>
                  <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{cat.count} items</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Products ─── */}
      <section style={{ padding: '48px 0', background: 'white' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}>Featured Products</h2>
              <p style={{ color: '#6B7280', marginTop: '4px' }}>Hand-picked organic goodness</p>
            </div>
            <Link to="/products" className="btn btn-outline" style={{ padding: '10px 20px' }}>View All →</Link>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><Loader /></div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
              {featuredProducts.map(product => <ProductCard key={product._id} product={product} />)}
            </div>
          )}
        </div>
      </section>

      {/* ─── Why Choose Us ─── */}
      <section style={{ padding: '64px 0' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', marginBottom: '48px' }}>Why GreenRoots?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
            {[
              { icon: '🌱', title: 'Farm to Table', desc: 'Direct sourcing from 200+ certified organic farms across India' },
              { icon: '🔬', title: 'Lab Tested', desc: 'Every product tested for pesticide residues and quality assurance' },
              { icon: '❄️', title: 'Cold Chain', desc: 'Temperature controlled logistics for freshness preservation' },
              { icon: '♻️', title: 'Eco Packaging', desc: 'Biodegradable and compostable packaging for a greener planet' },
            ].map(item => (
              <motion.div key={item.title} whileHover={{ y: -6 }}
                style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{item.icon}</div>
                <h3 style={{ fontSize: '1.1rem', fontFamily: 'Inter, sans-serif', fontWeight: 700, marginBottom: '8px' }}>{item.title}</h3>
                <p style={{ color: '#6B7280', fontSize: '0.9rem', lineHeight: 1.7 }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      <section style={{ background: 'linear-gradient(135deg, #2D6A4F, #1B4332)', padding: '60px 20px', textAlign: 'center' }}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }}>
          <h2 style={{ color: 'white', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', marginBottom: '12px' }}>Start Your Organic Journey Today</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '28px', fontSize: '1.05rem' }}>Get 10% off your first order. Use code: <strong style={{ color: '#74C69D' }}>ORGANIC10</strong></p>
          <Link to="/register" className="btn" style={{ background: '#74C69D', color: '#1B4332', fontWeight: 700, padding: '14px 32px', fontSize: '1rem' }}>Create Free Account</Link>
        </motion.div>
      </section>
    </>
  );
};

export default Home;
