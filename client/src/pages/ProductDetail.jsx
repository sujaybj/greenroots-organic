import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, CheckCircle2, XCircle, Loader2,
  Globe, AlertCircle, ShoppingCart, Zap, Star,
} from 'lucide-react';
import { fetchProduct } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import Loader from '../components/common/Loader';
import API from '../utils/api';

const StarRating = ({ rating, interactive = false, onRate }) => (
  <div style={{ display: 'flex', gap: '3px' }}>
    {[1,2,3,4,5].map(star => (
      <Star key={star}
        size={interactive ? 20 : 14}
        fill={star <= rating ? '#F59E0B' : 'none'}
        color={star <= rating ? '#F59E0B' : '#D1D5DB'}
        strokeWidth={1.5}
        onClick={() => interactive && onRate?.(star)}
        style={{ cursor: interactive ? 'pointer' : 'default' }}/>
    ))}
  </div>
);

// ── Delivery Checker Component ────────────────────────────────
const DeliveryChecker = ({ productId, isNationwide, deliverableAreas = [], deliveryNote }) => {
  const [pincode, setPincode]   = useState('');
  const [checking, setChecking] = useState(false);
  const [result, setResult]     = useState(null); // { deliverable, note }

  // Auto-check when pincode is 6 digits
  const checkDelivery = useCallback(async (pin) => {
    if (pin.length !== 6) { setResult(null); return; }
    setChecking(true);
    try {
      const { data } = await API.get(`/products/${productId}/delivery-check?pincode=${pin}`);
      setResult({ deliverable: data.deliverable, note: data.note });
    } catch {
      setResult({ deliverable: null, note: 'Unable to check. Please try again.' });
    } finally { setChecking(false); }
  }, [productId]);

  useEffect(() => { checkDelivery(pincode); }, [pincode, checkDelivery]);

  // Nationwide shortcut
  if (isNationwide) {
    return (
      <div style={{ background: '#F0FDF4', border: '1px solid #D1FAE5', borderRadius: '12px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Globe size={18} color="#2D6A4F"/>
        <div>
          <p style={{ fontWeight: 700, fontSize: '0.88rem', color: '#065F46', margin: 0 }}>Delivered across all of India</p>
          {deliveryNote && <p style={{ fontSize: '0.78rem', color: '#6B7280', margin: '3px 0 0' }}>{deliveryNote}</p>}
        </div>
      </div>
    );
  }

  // No delivery areas set
  if (!isNationwide && deliverableAreas.length === 0) {
    return (
      <div style={{ background: '#FFF8E1', border: '1px solid #FDE68A', borderRadius: '12px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <AlertCircle size={18} color="#D97706"/>
        <p style={{ fontSize: '0.85rem', color: '#92400E', margin: 0, fontWeight: 600 }}>
          Delivery area not yet configured. Contact us for availability.
        </p>
      </div>
    );
  }

  return (
    <div style={{ border: '1.5px solid #E5E7EB', borderRadius: '12px', padding: '14px 16px' }}>
      <p style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1B1B1B', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <MapPin size={14} color="#2D6A4F"/> Check Delivery
      </p>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <input
            type="text" inputMode="numeric" maxLength={6}
            placeholder="Enter 6-digit pincode"
            value={pincode}
            onChange={e => setPincode(e.target.value.replace(/\D/g,'').slice(0,6))}
            style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${result?.deliverable === false ? '#FCA5A5' : result?.deliverable === true ? '#86EFAC' : '#E5E7EB'}`, borderRadius: '9px', fontSize: '0.92rem', fontFamily: 'Inter,sans-serif', outline: 'none', background: 'white', letterSpacing: '0.1em', fontWeight: 600 }}/>
          {checking && (
            <Loader2 size={14} color="#2D6A4F" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', animation: 'spin 1s linear infinite' }}/>
          )}
        </div>
      </div>

      {/* Result */}
      <AnimatePresence>
        {result && !checking && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px 12px', background: result.deliverable ? '#F0FDF4' : '#FFF1F2', borderRadius: '8px', border: `1px solid ${result.deliverable ? '#D1FAE5' : '#FFE4E6'}` }}>
            {result.deliverable === true  && <CheckCircle2 size={16} color="#16A34A" style={{ flexShrink: 0, marginTop: '1px' }}/>}
            {result.deliverable === false && <XCircle      size={16} color="#DC2626" style={{ flexShrink: 0, marginTop: '1px' }}/>}
            {result.deliverable === null  && <AlertCircle  size={16} color="#D97706" style={{ flexShrink: 0, marginTop: '1px' }}/>}
            <div>
              <p style={{ fontWeight: 700, fontSize: '0.83rem', color: result.deliverable ? '#15803D' : '#DC2626', margin: 0 }}>
                {result.deliverable === true  ? `Delivery available to ${pincode}` :
                 result.deliverable === false ? `Not deliverable to ${pincode} yet` :
                 'Unable to check pincode'}
              </p>
              {result.note && <p style={{ fontSize: '0.76rem', color: '#6B7280', margin: '3px 0 0', lineHeight: 1.5 }}>{result.note}</p>}
              {result.deliverable === false && (
                <p style={{ fontSize: '0.75rem', color: '#6B7280', margin: '4px 0 0' }}>
                  Contact us at <a href="mailto:sujaybj8@gmail.com" style={{ color: '#2D6A4F', fontWeight: 600 }}>sujaybj8@gmail.com</a> to request delivery in your area.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Available states */}
      {deliverableAreas.length > 0 && (
        <div style={{ marginTop: '10px' }}>
          <p style={{ fontSize: '0.72rem', color: '#9CA3AF', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
            Currently delivering to
          </p>
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            {deliverableAreas.filter(a => a.isActive).map((area, i) => (
              <span key={i} style={{ background: '#F0FDF4', border: '1px solid #D1FAE5', color: '#065F46', fontSize: '0.72rem', fontWeight: 600, padding: '3px 8px', borderRadius: '100px' }}>
                {area.state}{area.cities.length > 0 ? ` (${area.cities.join(', ')})` : ''}
              </span>
            ))}
          </div>
        </div>
      )}

      {deliveryNote && (
        <p style={{ fontSize: '0.76rem', color: '#6B7280', marginTop: '10px', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <AlertCircle size={11} color="#9CA3AF"/> {deliveryNote}
        </p>
      )}
    </div>
  );
};

// ── Main ProductDetail ────────────────────────────────────────
const ProductDetail = () => {
  const { id }     = useParams();
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const { currentProduct: product, loading } = useSelector(s => s.product);
  const { isAuthenticated } = useSelector(s => s.auth);
  const [qty, setQty]         = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [tab, setTab]         = useState('desc');
  const [review, setReview]   = useState({ rating: 5, title: '', comment: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { dispatch(fetchProduct(id)); }, [id, dispatch]);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}><Loader/></div>;
  if (!product) return <div style={{ textAlign: 'center', padding: '80px', color: '#9CA3AF' }}>Product not found</div>;

  const discountPercent = product.price > (product.discountPrice || product.price)
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { navigate('/login'); return; }
    if (!review.title || !review.comment) { return; }
    setSubmitting(true);
    try {
      await API.post(`/products/${id}/review`, review);
      dispatch(fetchProduct(id));
      setReview({ rating: 5, title: '', comment: '' });
    } catch {} finally { setSubmitting(false); }
  };

  return (
    <>
      <Helmet><title>{product.name} — GreenRoots Organics</title></Helmet>
      <div className="container" style={{ paddingTop: '32px', paddingBottom: '64px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '48px' }}>

          {/* ── Images ── */}
          <div>
            <div style={{ borderRadius: '16px', overflow: 'hidden', marginBottom: '10px', background: '#F9FAFB', aspectRatio: '1' }}>
              <img src={product.images?.[activeImg]?.url || '/placeholder.jpg'} alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {product.images?.map((img, i) => (
                <img key={i} src={img.url} alt="" onClick={() => setActiveImg(i)}
                  style={{ width: '68px', height: '68px', objectFit: 'cover', borderRadius: '8px', cursor: 'pointer', border: i === activeImg ? '2.5px solid #2D6A4F' : '2px solid transparent', opacity: i === activeImg ? 1 : 0.65 }}/>
              ))}
            </div>
          </div>

          {/* ── Info ── */}
          <div>
            {/* Certifications */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
              {product.certifications?.map(cert => (
                <span key={cert} style={{ background: '#D1FAE5', color: '#065F46', padding: '3px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>{cert}</span>
              ))}
            </div>

            <h1 style={{ fontSize: 'clamp(1.4rem,3vw,1.9rem)', marginBottom: '10px', lineHeight: 1.2 }}>{product.name}</h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <StarRating rating={Math.round(product.rating)}/>
              <span style={{ color: '#6B7280', fontSize: '0.85rem' }}>({product.numReviews} reviews)</span>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: product.stock > 0 ? '#16A34A' : '#DC2626', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {product.stock > 0 ? <CheckCircle2 size={13}/> : <XCircle size={13}/>}
                {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '20px' }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: '#2D6A4F' }}>₹{product.discountPrice || product.price}</span>
              {discountPercent > 0 && <>
                <span style={{ fontSize: '1rem', color: '#9CA3AF', textDecoration: 'line-through' }}>₹{product.price}</span>
                <span style={{ background: '#FEE2E2', color: '#DC2626', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700 }}>{discountPercent}% OFF</span>
              </>}
              <span style={{ color: '#9CA3AF', fontSize: '0.88rem' }}>/{product.unit}</span>
            </div>

            <p style={{ color: '#4B5563', lineHeight: 1.8, marginBottom: '22px', fontSize: '0.93rem' }}>
              {product.shortDescription || product.description}
            </p>

            {/* Qty + Buttons */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #E5E7EB', borderRadius: '10px', overflow: 'hidden' }}>
                <button onClick={() => setQty(Math.max(1, qty-1))} style={{ width: '40px', height: '44px', border: 'none', background: '#F9FAFB', cursor: 'pointer', fontSize: '1.1rem', color: '#374151' }}>−</button>
                <span style={{ padding: '0 18px', fontWeight: 700, fontSize: '1rem' }}>{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock, qty+1))} style={{ width: '40px', height: '44px', border: 'none', background: '#F9FAFB', cursor: 'pointer', fontSize: '1.1rem', color: '#374151' }}>+</button>
              </div>
              <button onClick={() => { dispatch(addToCart({ product, quantity: qty })); }}
                disabled={product.stock === 0}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', padding: '12px', background: '#2D6A4F', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '0.92rem', cursor: product.stock === 0 ? 'not-allowed' : 'pointer', fontFamily: 'Inter,sans-serif', opacity: product.stock === 0 ? 0.5 : 1 }}>
                <ShoppingCart size={15}/> Add to Cart
              </button>
              <button onClick={() => { dispatch(addToCart({ product, quantity: qty })); navigate('/checkout'); }}
                disabled={product.stock === 0}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', padding: '12px', background: 'none', color: '#2D6A4F', border: '1.5px solid #2D6A4F', borderRadius: '10px', fontWeight: 700, fontSize: '0.92rem', cursor: product.stock === 0 ? 'not-allowed' : 'pointer', fontFamily: 'Inter,sans-serif', opacity: product.stock === 0 ? 0.5 : 1 }}>
                <Zap size={15}/> Buy Now
              </button>
            </div>

            {/* ── DELIVERY CHECKER — real time ── */}
            <DeliveryChecker
              productId={product._id}
              isNationwide={product.isNationwide}
              deliverableAreas={product.deliverableAreas || []}
              deliveryNote={product.deliveryNote}
            />
          </div>
        </div>

        {/* ── Tabs ── */}
        <div style={{ marginTop: '48px' }}>
          <div style={{ display: 'flex', gap: '4px', borderBottom: '2px solid #E5E7EB', marginBottom: '28px' }}>
            {[['desc','Description'],['ingredients','Ingredients'],['reviews',`Reviews (${product.numReviews})`]].map(([t, label]) => (
              <button key={t} onClick={() => setTab(t)}
                style={{ padding: '12px 20px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: tab===t ? 700 : 500, color: tab===t ? '#2D6A4F' : '#6B7280', borderBottom: tab===t ? '2px solid #2D6A4F' : '2px solid transparent', marginBottom: '-2px', fontSize: '0.92rem', fontFamily: 'Inter,sans-serif' }}>
                {label}
              </button>
            ))}
          </div>

          {tab === 'desc' && <p style={{ color: '#4B5563', lineHeight: 1.9, maxWidth: '700px', fontSize: '0.93rem' }}>{product.description}</p>}

          {tab === 'ingredients' && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {product.ingredients?.length > 0
                ? product.ingredients.map(ing => <span key={ing} style={{ background: '#F0FDF4', border: '1px solid #D1FAE5', color: '#065F46', padding: '6px 14px', borderRadius: '100px', fontSize: '0.85rem' }}>{ing}</span>)
                : <p style={{ color: '#9CA3AF' }}>No ingredients listed.</p>
              }
            </div>
          )}

          {tab === 'reviews' && (
            <div>
              {product.reviews?.map(r => (
                <div key={r._id} style={{ background: 'white', borderRadius: '12px', padding: '18px', marginBottom: '12px', boxShadow: '0 2px 6px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#2D6A4F', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.95rem', flexShrink: 0 }}>
                      {r.name[0].toUpperCase()}
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '0.92rem', margin: 0 }}>{r.name}</p>
                      <StarRating rating={r.rating}/>
                    </div>
                    <span style={{ marginLeft: 'auto', color: '#9CA3AF', fontSize: '0.78rem' }}>{new Date(r.createdAt).toLocaleDateString('en-IN')}</span>
                  </div>
                  <h4 style={{ fontFamily: 'Inter,sans-serif', fontWeight: 600, marginBottom: '5px', fontSize: '0.9rem' }}>{r.title}</h4>
                  <p style={{ color: '#4B5563', fontSize: '0.88rem', lineHeight: 1.7, margin: 0 }}>{r.comment}</p>
                </div>
              ))}
              {product.reviews?.length === 0 && <p style={{ color: '#9CA3AF', marginBottom: '24px' }}>No reviews yet. Be the first!</p>}

              {/* Add review form */}
              {isAuthenticated && (
                <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginTop: '20px', border: '1px solid #F3F4F6' }}>
                  <h3 style={{ fontFamily: 'Inter,sans-serif', fontWeight: 700, marginBottom: '16px', fontSize: '1rem' }}>Write a Review</h3>
                  <form onSubmit={handleReviewSubmit}>
                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Rating</label>
                      <StarRating rating={review.rating} interactive onRate={r => setReview(rv => ({ ...rv, rating: r }))}/>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Title</label>
                      <input className="form-input" placeholder="Review title" value={review.title}
                        onChange={e => setReview(rv => ({ ...rv, title: e.target.value }))}/>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Comment</label>
                      <textarea className="form-input" rows={4} placeholder="Share your experience..." value={review.comment}
                        onChange={e => setReview(rv => ({ ...rv, comment: e.target.value }))} style={{ resize: 'vertical' }}/>
                    </div>
                    <button type="submit" disabled={submitting}
                      style={{ padding: '11px 24px', background: '#2D6A4F', color: 'white', border: 'none', borderRadius: '9px', fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: 'Inter,sans-serif', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {submitting ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }}/> Submitting...</> : 'Submit Review'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
};

export default ProductDetail;
