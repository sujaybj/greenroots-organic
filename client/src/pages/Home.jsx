import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  ShoppingCart, BookOpen, Leaf, Zap,
  Truck, Lock, RefreshCw, Star,
  Bike, Clock, MapPin, Shield, Thermometer
} from 'lucide-react';
import { fetchProducts, fetchCategories } from '../redux/slices/productSlice';
import ProductCard from '../components/product/ProductCard';
import Loader from '../components/common/Loader';

const CATEGORY_ICONS = {
  Vegetables: '🥦', Fruits: '🍎', Dairy: '🥛', Grains: '🌾',
  Pulses: '🫘', Spices: '🌶️', Oils: '🫙', Beverages: '🍵',
  Skincare: '🌹', Other: '🌿',
};

const TRUST_BADGES = [
  { Icon: Truck,     text: 'Free Delivery ₹500+' },
  { Icon: Lock,      text: 'Secure Payments'      },
  { Icon: RefreshCw, text: '7-Day Returns'         },
  { Icon: Star,      text: '4.8/5 Rating'          },
  { Icon: Leaf,      text: 'Fresh & Natural'       },
];

const WHY_CARDS = [
  { Icon: Bike,        title: 'Express Delivery',     desc: 'Same-day delivery to your doorstep — order by noon, receive by evening.' },
  { Icon: MapPin,      title: 'Live Tracking',        desc: 'Track your delivery agent in real-time. Know exactly when your order arrives.' },
  { Icon: Thermometer, title: 'Cold Chain Logistics', desc: 'Temperature-controlled vehicles preserve freshness from farm to front door.' },
  { Icon: Shield,      title: 'Safe & Verified',      desc: 'All delivery agents are background-verified and trained in safe handling.' },
];

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

      {/* ── Hero — delivery-themed image ── */}
      <section style={{ position: 'relative', minHeight: 'clamp(420px,65vh,620px)', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <img
          src="https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=1600&q=85&auto=format&fit=crop"
          alt="Organic delivery"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%' }}
          loading="eager"
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(100deg, rgba(10,30,18,0.88) 0%, rgba(20,50,30,0.70) 45%, rgba(20,50,30,0.15) 100%)' }}/>

        <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: '60px', paddingBottom: '60px' }}>
          <div style={{ maxWidth: '580px' }}>
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.65 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(116,198,157,0.2)', color: '#74C69D', padding: '6px 14px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 700, border: '1px solid rgba(116,198,157,0.35)', marginBottom: '20px' }}>
                <Leaf size={13}/> GreenRoots Organics
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
                  <ShoppingCart size={16}/> Shop Now
                </Link>
                <Link to="/about"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.12)', color: 'white', fontWeight: 600, padding: '13px 22px', borderRadius: '9px', fontSize: '0.95rem', textDecoration: 'none', border: '1.5px solid rgba(255,255,255,0.35)', backdropFilter: 'blur(6px)' }}>
                  <BookOpen size={15}/> Our Story
                </Link>
              </div>

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

      {/* ── Trust Badges with Lucide icons ── */}
      <section style={{ background: 'white', padding: '16px 0', borderBottom: '1px solid #E5E7EB' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 'clamp(14px,3vw,32px)' }}>
          {TRUST_BADGES.map(({ Icon, text }) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '0.85rem', fontWeight: 500, color: '#374151' }}>
              <Icon size={16} color="#2D6A4F"/> {text}
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

      {/* ── Why GreenRoots — delivery theme ── */}
      <section style={{ padding: 'clamp(40px,6vw,64px) 0', background: '#F6FAF6' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#D1FAE5', color: '#065F46', padding: '5px 14px', borderRadius: '100px', fontSize: '0.78rem', fontWeight: 700, marginBottom: '12px' }}>
              <Truck size={12}/> Delivery Excellence
            </span>
            <h2 style={{ fontSize: 'clamp(1.4rem,3vw,2rem)', marginBottom: '8px' }}>From Farm to Your Door</h2>
            <p style={{ color: '#6B7280', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto' }}>
              We don't just grow organic — we deliver it fast, safe, and fresh.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '20px' }}>
            {WHY_CARDS.map(({ Icon, title, desc }) => (
              <motion.div key={title} whileHover={{ y: -5 }}
                style={{ background: 'white', borderRadius: '14px', padding: '26px 20px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', textAlign: 'center', border: '1px solid #F3F4F6' }}>
                <div style={{ background: '#F0FDF4', borderRadius: '12px', width: '52px', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                  <Icon size={22} color="#2D6A4F"/>
                </div>
                <h3 style={{ fontSize: '0.98rem', fontFamily: 'Inter,sans-serif', fontWeight: 700, marginBottom: '8px' }}>{title}</h3>
                <p style={{ color: '#6B7280', fontSize: '0.85rem', lineHeight: 1.7 }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        <img
          src="https://images.unsplash.com/photo-1580913428735-bd3c269d6a82?w=1400&q=80&auto=format"
          alt="Delivery fresh produce"
          style={{ width: '100%', height: 'clamp(220px,30vw,320px)', objectFit: 'cover', display: 'block' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(27,67,50,0.88),rgba(45,106,79,0.82))', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '32px 20px' }}>
          <h2 style={{ color: 'white', fontSize: 'clamp(1.3rem,3vw,2rem)', marginBottom: '10px', fontFamily: 'Playfair Display,serif' }}>Start Your Journey Today</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '22px', fontSize: 'clamp(0.85rem,1.5vw,0.98rem)' }}>
            Get 10% off your first order · Code: <strong style={{ color: '#74C69D' }}>ORGANIC10</strong>
          </p>
          <Link to="/register" style={{ background: '#74C69D', color: '#1B4332', fontWeight: 700, padding: '13px 28px', borderRadius: '9px', fontSize: '0.95rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={15}/> Create Free Account
          </Link>
        </div>
      </section>

      <style>{`
        @media (max-width: 600px) {
          .container > div[style*="maxWidth: '580px'"] { max-width: 100% !important; }
        }
      `}</style>
    </>
  );
};

export default Home;
