import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  Leaf, Truck, ShieldCheck, RotateCcw, Star,
  ShoppingBag, ArrowRight, CheckCircle2, Sparkles,
  FlaskConical, Snowflake, Recycle,
  Cherry, Milk, Wheat, Bean, Flame, Droplets, Coffee, Heart
} from 'lucide-react';
import { fetchProducts, fetchCategories } from '../redux/slices/productSlice';
import ProductCard from '../components/product/ProductCard';
import Loader from '../components/common/Loader';

const CATEGORY_ICONS = {
  Vegetables: Leaf,
  Fruits: Cherry,
  Dairy: Milk,
  Grains: Wheat,
  Pulses: Bean,
  Spices: Flame,
  Oils: Droplets,
  Beverages: Coffee,
  Skincare: Heart,
  Other: Sparkles,
};

const CATEGORY_COLORS = {
  Vegetables: '#16A34A',
  Fruits: '#EA580C',
  Dairy: '#2563EB',
  Grains: '#CA8A04',
  Pulses: '#9333EA',
  Spices: '#DC2626',
  Oils: '#0891B2',
  Beverages: '#65A30D',
  Skincare: '#EC4899',
  Other: '#6B7280',
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

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

  const trustBadges = [
    { icon: ShieldCheck, label: 'Certified Organic', sub: '100% verified' },
    { icon: Truck, label: 'Free Delivery', sub: 'Orders ₹500+' },
    { icon: ShieldCheck, label: 'Secure Payments', sub: 'SSL encrypted' },
    { icon: RotateCcw, label: 'Easy Returns', sub: '7-day policy' },
    { icon: Star, label: 'Top Rated', sub: '4.8/5 stars' },
  ];

  const whyCards = [
    { icon: Leaf, title: 'Farm to Table', desc: 'Direct sourcing from 200+ certified organic farms across India.', color: '#16A34A' },
    { icon: FlaskConical, title: 'Lab Tested', desc: 'Every product tested for pesticide residues and quality assurance.', color: '#2563EB' },
    { icon: Snowflake, title: 'Cold Chain', desc: 'Temperature-controlled logistics for maximum freshness.', color: '#0891B2' },
    { icon: Recycle, title: 'Eco Packaging', desc: 'Biodegradable and compostable packaging for a greener planet.', color: '#65A30D' },
  ];

  return (
    <>
      <Helmet>
        <title>GreenRoots Organics - Pure, Natural, Organic</title>
        <meta name="description" content="Shop certified organic vegetables, fruits, dairy, and more. Farm fresh, delivered to your door." />
      </Helmet>

      {/* ─── Hero Section ─── */}
      <section className="home-hero">
        <div className="container home-hero__inner">
          <motion.div
            className="home-hero__content"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="home-hero__badge">
              <Leaf size={14} />
              GreenRoots Organics
            </span>
            <h1 className="home-hero__title">
              Nature's Best,<br />Delivered Fresh
            </h1>
            <p className="home-hero__subtitle">
              From certified organic farms to your table. No pesticides, no chemicals — just pure goodness your family deserves.
            </p>
            <div className="home-hero__actions">
              <Link to="/products" className="btn btn-primary btn-lg home-hero__cta">
                <ShoppingBag size={18} />
                Shop Now
              </Link>
              <Link to="/about" className="btn btn-outline btn-lg home-hero__cta-outline">
                Our Story
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="home-hero__stats">
              {[['500+', 'Products'], ['50K+', 'Happy Customers'], ['4.8', 'Avg Rating']].map(([num, label]) => (
                <div key={label} className="home-hero__stat">
                  <span className="home-hero__stat-num">{num}</span>
                  <span className="home-hero__stat-label">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div
            className="home-hero__image"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <img src="/images/hero-banner.png" alt="Fresh organic produce" />
          </motion.div>
        </div>
      </section>

      {/* ─── Trust Badges ─── */}
      <section className="home-trust">
        <div className="container">
          <div className="home-trust__grid trust-badges">
            {trustBadges.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="home-trust__item">
                <div className="home-trust__icon-wrap">
                  <Icon size={20} strokeWidth={2} />
                </div>
                <div>
                  <div className="home-trust__label">{label}</div>
                  <div className="home-trust__sub">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Categories ─── */}
      <section className="home-categories section-lg">
        <div className="container">
          <div className="home-section-header">
            <div>
              <h2 className="home-section-title">Shop by Category</h2>
              <p className="home-section-subtitle">Explore our wide range of organic products</p>
            </div>
            <Link to="/products" className="btn btn-outline btn-sm home-section-link">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="home-categories__grid">
            {categories.map((cat, i) => {
              const Icon = CATEGORY_ICONS[cat._id] || Sparkles;
              const color = CATEGORY_COLORS[cat._id] || '#6B7280';
              return (
                <motion.div
                  key={cat._id}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                >
                  <Link to={`/products?category=${cat._id}`} className="home-category-card">
                    <div className="home-category-card__icon" style={{ background: `${color}12`, color }}>
                      <Icon size={28} strokeWidth={1.8} />
                    </div>
                    <span className="home-category-card__name">{cat._id}</span>
                    <span className="home-category-card__count">{cat.count} items</span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Featured Products ─── */}
      <section className="home-featured section-md" style={{ background: 'white' }}>
        <div className="container">
          <div className="home-section-header">
            <div>
              <h2 className="home-section-title">Featured Products</h2>
              <p className="home-section-subtitle">Hand-picked organic goodness</p>
            </div>
            <Link to="/products" className="btn btn-outline btn-sm home-section-link">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><Loader /></div>
          ) : (
            <div className="product-grid">
              {featuredProducts.map(product => <ProductCard key={product._id} product={product} />)}
            </div>
          )}
        </div>
      </section>

      {/* ─── Why Choose Us ─── */}
      <section className="home-why section-lg">
        <div className="container">
          <div className="home-section-header" style={{ justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <h2 className="home-section-title">Why GreenRoots?</h2>
              <p className="home-section-subtitle">We go the extra mile for quality you can trust</p>
            </div>
          </div>
          <div className="home-why__grid">
            {whyCards.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  className="home-why__card"
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  whileHover={{ y: -6 }}
                >
                  <div className="home-why__card-icon" style={{ background: `${item.color}12`, color: item.color }}>
                    <Icon size={28} strokeWidth={1.8} />
                  </div>
                  <h3 className="home-why__card-title">{item.title}</h3>
                  <p className="home-why__card-desc">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Promo Banner ─── */}
      <section className="home-promo">
        <div className="container">
          <motion.div
            className="home-promo__inner"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="home-promo__content">
              <div className="home-promo__badge">
                <Sparkles size={14} />
                Limited Time Offer
              </div>
              <h2 className="home-promo__title">Start Your Organic Journey Today</h2>
              <p className="home-promo__text">
                Get <strong>10% off</strong> your first order with code
              </p>
              <div className="home-promo__code">ORGANIC10</div>
              <Link to="/register" className="btn btn-primary btn-lg home-promo__cta">
                <CheckCircle2 size={18} />
                Create Free Account
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Home;
