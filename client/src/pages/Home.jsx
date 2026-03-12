import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { fetchProducts, fetchCategories } from '../redux/slices/productSlice';
import ProductCard from '../components/product/ProductCard';
import Loader from '../components/common/Loader';

const CATEGORY_ICONS = { Vegetables:'🥦', Fruits:'🍎', Dairy:'🥛', Grains:'🌾', Pulses:'🫘', Spices:'🌶️', Oils:'🫙', Beverages:'🍵', Skincare:'🌹', Other:'🌿' };

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading, categories } = useSelector(s => s.product);
  const [featured, setFeatured] = useState([]);
  useEffect(() => { dispatch(fetchProducts({ featured: true, limit: 8 })); dispatch(fetchCategories()); }, [dispatch]);
  useEffect(() => { setFeatured(products); }, [products]);

  return (
    <>
      <Helmet>
        <title>GreenRoots Organics - Pure, Natural, Organic</title>
        <meta name="description" content="Shop certified organic vegetables, fruits, dairy and more. Farm fresh, delivered to your door." />
      </Helmet>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg,#1B4332 0%,#2D6A4F 60%,#40916C 100%)', padding: 'clamp(40px,8vw,80px) 0', overflow: 'hidden' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px,1fr))', gap: 'clamp(24px,5vw,48px)', alignItems: 'center' }}>
            <div>
              <span style={{ background: 'rgba(116,198,157,0.3)', color: '#74C69D', padding: '6px 16px', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 600 }}>🌱 100% Certified Organic</span>
              <h1 style={{ color: 'white', fontSize: 'clamp(1.8rem,5vw,3.2rem)', marginTop: '16px', lineHeight: 1.2, fontFamily: 'Playfair Display, serif' }}>
                Nature's Best,<br />Delivered Fresh
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 'clamp(0.9rem,2vw,1.05rem)', marginTop: '14px', lineHeight: 1.8, maxWidth: '420px' }}>
                From certified organic farms to your table. No pesticides, no chemicals — just pure goodness your family deserves.
              </p>
              <div style={{ display: 'flex', gap: '12px', marginTop: '28px', flexWrap: 'wrap' }}>
                <Link to="/products" className="btn" style={{ background: '#74C69D', color: '#1B4332', fontWeight: 700 }}>Shop Now 🛒</Link>
                <Link to="/about" className="btn btn-outline" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}>Our Story</Link>
              </div>
              <div style={{ display: 'flex', gap: 'clamp(16px,4vw,32px)', marginTop: '28px', flexWrap: 'wrap' }}>
                {[['500+','Products'],['50K+','Customers'],['100%','Organic']].map(([n,l]) => (
                  <div key={l}>
                    <div style={{ color: '#74C69D', fontWeight: 700, fontSize: 'clamp(1.1rem,3vw,1.4rem)', fontFamily: 'Playfair Display, serif' }}>{n}</div>
                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem' }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', fontSize: 'clamp(80px,15vw,160px)', lineHeight: 1 }}>🥬</div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section style={{ background: 'white', padding: '14px 0', borderBottom: '1px solid #E5E7EB' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 'clamp(10px,3vw,28px)' }}>
            {[['🌿','Certified Organic'],['🚚','Free Delivery ₹500+'],['🔒','Secure Payments'],['↩️','7-Day Returns'],['⭐','4.8/5 Rating']].map(([icon,text]) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'clamp(0.76rem,2vw,0.9rem)', fontWeight: 500, color: '#374151' }}>
                <span>{icon}</span>
                <span className="hide-small">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: 'clamp(32px,6vw,64px) 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'clamp(20px,4vw,40px)' }}>
            <h2 style={{ fontSize: 'clamp(1.4rem,4vw,2.2rem)' }}>Shop by Category</h2>
            <p style={{ color: '#6B7280', marginTop: '8px', fontSize: 'clamp(0.85rem,2vw,1rem)' }}>Explore our wide range of organic products</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(100px,1fr))', gap: 'clamp(8px,2vw,16px)' }}>
            {categories.map(cat => (
              <Link key={cat._id} to={`/products?category=${cat._id}`}
                style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: 'clamp(12px,2vw,20px) 8px', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1.5px solid #F3F4F6', transition: 'all 0.2s' }}
                onMouseOver={e => { e.currentTarget.style.borderColor='#2D6A4F'; e.currentTarget.style.transform='translateY(-3px)'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor='#F3F4F6'; e.currentTarget.style.transform='none'; }}>
                <span style={{ fontSize: 'clamp(1.4rem,4vw,2rem)' }}>{CATEGORY_ICONS[cat._id]||'🌿'}</span>
                <span style={{ fontSize: 'clamp(0.7rem,1.8vw,0.85rem)', fontWeight: 600, color: '#374151', textAlign: 'center', lineHeight: 1.3 }}>{cat._id}</span>
                <span style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>{cat.count}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section style={{ padding: 'clamp(28px,5vw,48px) 0', background: 'white' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'clamp(18px,4vw,32px)', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: 'clamp(1.4rem,4vw,2.2rem)' }}>Featured Products</h2>
              <p style={{ color: '#6B7280', marginTop: '4px', fontSize: 'clamp(0.82rem,2vw,0.95rem)' }}>Hand-picked organic goodness</p>
            </div>
            <Link to="/products" className="btn btn-outline" style={{ padding: '9px 18px', fontSize: '0.88rem' }}>View All →</Link>
          </div>
          {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><Loader /></div> : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,190px),1fr))', gap: 'clamp(10px,2vw,20px)' }}>
              {featured.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* Why Us */}
      <section style={{ padding: 'clamp(32px,6vw,64px) 0' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.4rem,4vw,2.2rem)', marginBottom: 'clamp(24px,5vw,48px)' }}>Why GreenRoots?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: 'clamp(12px,2vw,24px)' }}>
            {[{icon:'🌱',title:'Farm to Table',desc:'Direct from 200+ certified organic farms across India'},{icon:'🔬',title:'Lab Tested',desc:'Every product tested for pesticides and quality'},{icon:'❄️',title:'Cold Chain',desc:'Temperature controlled for freshness all the way'},{icon:'♻️',title:'Eco Packaging',desc:'Biodegradable packaging for a greener planet'}].map(item => (
              <div key={item.title} style={{ background: 'white', borderRadius: '16px', padding: 'clamp(16px,3vw,28px)', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', textAlign: 'center', transition: 'transform 0.2s' }}
                onMouseOver={e => e.currentTarget.style.transform='translateY(-4px)'}
                onMouseOut={e => e.currentTarget.style.transform='none'}>
                <div style={{ fontSize: 'clamp(1.8rem,4vw,2.5rem)', marginBottom: '12px' }}>{item.icon}</div>
                <h3 style={{ fontSize: 'clamp(0.92rem,2vw,1.05rem)', fontFamily: 'Inter,sans-serif', fontWeight: 700, marginBottom: '8px' }}>{item.title}</h3>
                <p style={{ color: '#6B7280', fontSize: 'clamp(0.8rem,1.8vw,0.9rem)', lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg,#2D6A4F,#1B4332)', padding: 'clamp(36px,8vw,60px) 20px', textAlign: 'center' }}>
        <h2 style={{ color: 'white', fontSize: 'clamp(1.3rem,4vw,2.4rem)', marginBottom: '12px' }}>Start Your Organic Journey Today</h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '24px', fontSize: 'clamp(0.88rem,2vw,1.05rem)' }}>
          Get 10% off your first order. Use code: <strong style={{ color: '#74C69D' }}>ORGANIC10</strong>
        </p>
        <Link to="/register" className="btn" style={{ background: '#74C69D', color: '#1B4332', fontWeight: 700, padding: '14px 32px' }}>Create Free Account</Link>
      </section>
    </>
  );
};
export default Home;
