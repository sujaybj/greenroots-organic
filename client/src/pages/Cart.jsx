import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { FaTag, FaChevronRight, FaCheckCircle, FaTimes, FaShoppingBag, FaTruck, FaLock } from 'react-icons/fa';
import { MdLocalOffer } from 'react-icons/md';
import {
  removeFromCart, updateQuantity, applyCoupon, removeCoupon,
  selectCartSubtotal, selectCartTotal, selectCartDiscount, selectCartCoupon
} from '../redux/slices/cartSlice';
import API from '../utils/api';
import toast from 'react-hot-toast';
import BackNav from '../components/common/BackNav';

// All available coupons shown in the UI (same as seeded)
const AVAILABLE_COUPONS = [
  { code: 'ORGANIC10', title: '10% off',       desc: '10% off on orders above ₹200',    minOrder: 200, tag: 'POPULAR'  },
  { code: 'WELCOME50', title: '₹50 off',        desc: '₹50 flat off on orders above ₹300', minOrder: 300, tag: 'NEW USER' },
  { code: 'GREEN20',   title: '20% off',        desc: '20% off on orders above ₹500',    minOrder: 500, tag: 'HOT'      },
  { code: 'FRESH100',  title: '₹100 off',       desc: '₹100 flat off on orders above ₹800', minOrder: 800, tag: ''      },
  { code: 'NEWUSER',   title: '15% off',        desc: '15% off — no minimum order!',     minOrder: 0,   tag: 'NEW'     },
];

const Cart = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { items } = useSelector(state => state.cart);
  const { isAuthenticated } = useSelector(state => state.auth);
  const subtotal  = useSelector(selectCartSubtotal);
  const total     = useSelector(selectCartTotal);
  const discount  = useSelector(selectCartDiscount);
  const coupon    = useSelector(selectCartCoupon);
  const shipping  = subtotal > 500 ? 0 : 50;
  const tax       = Math.round(subtotal * 0.05);

  const [couponCode, setCouponCode]       = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [showCouponPanel, setShowCouponPanel] = useState(false);

  const handleApplyCoupon = async (code) => {
    const codeToApply = (code || couponCode).trim().toUpperCase();
    if (!codeToApply) { toast.error('Enter a coupon code'); return; }
    if (!isAuthenticated) { toast.error('Please login to apply coupons'); navigate('/login'); return; }
    setCouponLoading(true);
    try {
      const { data } = await API.post('/cart/apply-coupon', {
        code: codeToApply,
        orderAmount: subtotal,
      });
      dispatch(applyCoupon({ couponCode: data.couponCode, discount: data.discount }));
      toast.success(data.message || `Coupon applied! You save ₹${data.discount}`);
      setCouponCode('');
      setShowCouponPanel(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid coupon code');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) { toast.error('Please login to checkout'); navigate('/login'); return; }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', padding: '40px 20px', textAlign: 'center' }}>
        <FaShoppingBag style={{ fontSize: '5rem', color: '#D1FAE5' }} />
        <h2 style={{ fontSize: '1.6rem', color: '#374151' }}>Your cart is empty</h2>
        <p style={{ color: '#9CA3AF' }}>Add some organic goodness to get started!</p>
        <Link to="/products" className="btn btn-primary btn-lg">Browse Products</Link>
      </div>
    );
  }

  return (
    <>
      <Helmet><title>My Cart - GreenRoots Organics</title></Helmet>
      <div className="container" style={{ paddingTop: '32px', paddingBottom: '64px' }}>
        <div style={{ marginBottom: '10px' }}>
          <BackNav label="Back" fallback="/products" />
        </div>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '28px' }}>
          My Cart <span style={{ fontSize: '1rem', color: '#6B7280', fontFamily: 'Inter, sans-serif', fontWeight: 400 }}>({items.length} {items.length === 1 ? 'item' : 'items'})</span>
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '28px', alignItems: 'start' }} className="cart-grid">

          {/* ── Left: Cart Items ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <AnimatePresence>
              {items.map(item => (
                <motion.div key={item.product}
                  initial={{ opacity: 1 }} exit={{ opacity: 0, x: -80 }} transition={{ duration: 0.2 }}
                  style={{ background: 'white', borderRadius: '12px', padding: '16px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', display: 'flex', gap: '14px', alignItems: 'center', border: '1px solid #F3F4F6' }}>
                  <Link to={`/products/${item.product}`} style={{ flexShrink: 0 }}>
                    <img src={item.image || '/placeholder.jpg'} alt={item.name}
                      style={{ width: '76px', height: '76px', objectFit: 'cover', borderRadius: '8px', background: '#F9FAFB' }} />
                  </Link>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Link to={`/products/${item.product}`} style={{ fontWeight: 600, fontSize: '0.93rem', color: '#1B1B1B', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.name}
                    </Link>
                    <p style={{ color: '#9CA3AF', fontSize: '0.82rem', marginTop: '3px' }}>₹{item.price}/{item.unit}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '10px' }}>
                      {/* Qty controls */}
                      <div style={{ display: 'inline-flex', alignItems: 'center', border: '1.5px solid #2D6A4F', borderRadius: '8px', overflow: 'hidden' }}>
                        <button onClick={() => dispatch(updateQuantity({ productId: item.product, quantity: item.quantity - 1 }))}
                          style={{ width: '30px', height: '30px', border: 'none', background: 'white', cursor: 'pointer', color: '#2D6A4F', fontWeight: 700, fontSize: '1.1rem' }}>−</button>
                        <span style={{ padding: '0 12px', fontWeight: 700, fontSize: '0.9rem', color: '#2D6A4F', borderLeft: '1px solid #E5E7EB', borderRight: '1px solid #E5E7EB' }}>{item.quantity}</span>
                        <button onClick={() => dispatch(updateQuantity({ productId: item.product, quantity: item.quantity + 1 }))}
                          style={{ width: '30px', height: '30px', border: 'none', background: 'white', cursor: 'pointer', color: '#2D6A4F', fontWeight: 700, fontSize: '1.1rem' }}>+</button>
                      </div>
                      <span style={{ fontWeight: 700, color: '#1B1B1B', fontSize: '0.98rem' }}>₹{item.price * item.quantity}</span>
                    </div>
                  </div>
                  <button onClick={() => dispatch(removeFromCart(item.product))}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#D1D5DB', padding: '4px', borderRadius: '6px', transition: 'color 0.2s' }}
                    onMouseOver={e => e.currentTarget.style.color = '#EF4444'}
                    onMouseOut={e => e.currentTarget.style.color = '#D1D5DB'}>
                    <FaTimes style={{ fontSize: '1rem' }} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* ── Swiggy-style Offers Panel ── */}
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #F3F4F6', overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
              {/* Header */}
              <button
                onClick={() => setShowCouponPanel(!showCouponPanel)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ background: '#D1FAE5', borderRadius: '8px', padding: '8px', display: 'flex' }}>
                  <MdLocalOffer style={{ fontSize: '1.2rem', color: '#2D6A4F' }} />
                </div>
                <div style={{ flex: 1 }}>
                  {coupon ? (
                    <p style={{ fontWeight: 700, color: '#2D6A4F', fontSize: '0.92rem', margin: 0 }}>
                      <FaCheckCircle style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                      {coupon} applied — You save ₹{discount}!
                    </p>
                  ) : (
                    <p style={{ fontWeight: 600, color: '#1B1B1B', fontSize: '0.92rem', margin: 0 }}>View available offers</p>
                  )}
                  <p style={{ fontSize: '0.78rem', color: '#9CA3AF', margin: '2px 0 0' }}>
                    {AVAILABLE_COUPONS.length} offers available
                  </p>
                </div>
                {coupon ? (
                  <button onClick={(e) => { e.stopPropagation(); dispatch(removeCoupon()); }}
                    style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', padding: '4px 8px', borderRadius: '4px' }}>
                    Remove
                  </button>
                ) : (
                  <FaChevronRight style={{ color: '#9CA3AF', transform: showCouponPanel ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
                )}
              </button>

              {/* Coupon Panel — Swiggy style */}
              <AnimatePresence>
                {showCouponPanel && !coupon && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ overflow: 'hidden' }}>
                    <div style={{ borderTop: '1px solid #F3F4F6', padding: '16px' }}>
                      {/* Manual entry */}
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                        <input
                          className="form-input"
                          placeholder="Enter coupon code"
                          value={couponCode}
                          onChange={e => setCouponCode(e.target.value.toUpperCase())}
                          onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                          style={{ flex: 1, padding: '10px 14px', fontSize: '0.9rem', letterSpacing: '0.05em', fontWeight: 600 }}
                        />
                        <button
                          onClick={() => handleApplyCoupon()}
                          disabled={couponLoading || !couponCode.trim()}
                          style={{ padding: '10px 18px', background: couponCode.trim() ? '#2D6A4F' : '#F3F4F6', color: couponCode.trim() ? 'white' : '#9CA3AF', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.88rem', cursor: couponCode.trim() ? 'pointer' : 'not-allowed', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s' }}>
                          {couponLoading ? '...' : 'Apply'}
                        </button>
                      </div>

                      {/* Available coupons list */}
                      <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                        Available Offers
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {AVAILABLE_COUPONS.map(c => {
                          const eligible = subtotal >= c.minOrder;
                          return (
                            <div key={c.code}
                              style={{ border: `1.5px dashed ${eligible ? '#2D6A4F' : '#E5E7EB'}`, borderRadius: '10px', padding: '12px 14px', background: eligible ? '#F0FDF4' : '#FAFAFA', opacity: eligible ? 1 : 0.7 }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                                  <FaTag style={{ color: eligible ? '#2D6A4F' : '#9CA3AF', fontSize: '0.85rem', flexShrink: 0 }} />
                                  <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1B1B1B', letterSpacing: '0.04em' }}>{c.code}</span>
                                      {c.tag && (
                                        <span style={{ background: '#2D6A4F', color: 'white', fontSize: '0.6rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px' }}>{c.tag}</span>
                                      )}
                                    </div>
                                    <p style={{ fontSize: '0.78rem', color: '#6B7280', margin: '3px 0 0' }}>{c.desc}</p>
                                    {!eligible && c.minOrder > 0 && (
                                      <p style={{ fontSize: '0.73rem', color: '#F59E0B', margin: '3px 0 0', fontWeight: 600 }}>
                                        Add ₹{c.minOrder - subtotal} more to unlock
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <button
                                  onClick={() => eligible && handleApplyCoupon(c.code)}
                                  disabled={!eligible}
                                  style={{ padding: '7px 14px', background: 'none', border: `1.5px solid ${eligible ? '#2D6A4F' : '#E5E7EB'}`, borderRadius: '6px', color: eligible ? '#2D6A4F' : '#9CA3AF', fontWeight: 700, fontSize: '0.82rem', cursor: eligible ? 'pointer' : 'not-allowed', whiteSpace: 'nowrap', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s' }}
                                  onMouseOver={e => { if (eligible) { e.currentTarget.style.background = '#2D6A4F'; e.currentTarget.style.color = 'white'; } }}
                                  onMouseOut={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = eligible ? '#2D6A4F' : '#9CA3AF'; }}>
                                  {eligible ? 'Apply' : 'Locked'}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Free delivery progress */}
            {shipping > 0 && (
              <div style={{ background: '#FFF7ED', borderRadius: '10px', padding: '14px 16px', border: '1px solid #FED7AA' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <FaTruck style={{ color: '#F59E0B' }} />
                  <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#92400E', margin: 0 }}>
                    Add ₹{500 - subtotal} more for FREE delivery!
                  </p>
                </div>
                <div style={{ background: '#FED7AA', borderRadius: '100px', height: '6px' }}>
                  <div style={{ background: '#F59E0B', borderRadius: '100px', height: '100%', width: `${Math.min((subtotal / 500) * 100, 100)}%`, transition: 'width 0.4s' }} />
                </div>
              </div>
            )}
          </div>

          {/* ── Right: Order Summary ── */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', position: 'sticky', top: '80px', border: '1px solid #F3F4F6' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '20px', fontFamily: 'Inter, sans-serif', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6B7280' }}>
              Order Summary
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '13px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#374151' }}>
                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span style={{ fontWeight: 600 }}>₹{subtotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FaTruck style={{ color: '#9CA3AF', fontSize: '0.8rem' }} /> Delivery</span>
                <span style={{ fontWeight: 600, color: shipping === 0 ? '#22C55E' : '#374151' }}>
                  {shipping === 0 ? 'FREE' : `₹${shipping}`}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#374151' }}>
                <span>GST (5%)</span>
                <span style={{ fontWeight: 600 }}>₹{tax}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#22C55E', background: '#F0FDF4', borderRadius: '6px', padding: '8px 10px', margin: '0 -4px' }}>
                  <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <FaTag style={{ fontSize: '0.75rem' }} /> Coupon ({coupon})
                  </span>
                  <span style={{ fontWeight: 700 }}>−₹{discount}</span>
                </div>
              )}
              <div style={{ borderTop: '2px solid #F3F4F6', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem' }}>
                <span>Total</span>
                <span style={{ color: '#2D6A4F' }}>₹{total}</span>
              </div>
              {discount > 0 && (
                <div style={{ background: '#D1FAE5', borderRadius: '6px', padding: '8px 12px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#065F46' }}>
                    Great! You're saving ₹{discount} on this order!
                  </span>
                </div>
              )}
            </div>

            <button onClick={handleCheckout} style={{
              width: '100%', padding: '14px', background: '#2D6A4F', color: 'white',
              border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '1rem',
              cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'background 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}
              onMouseOver={e => e.currentTarget.style.background = '#1B4332'}
              onMouseOut={e => e.currentTarget.style.background = '#2D6A4F'}>
              Proceed to Checkout →
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '12px' }}>
              <FaLock style={{ fontSize: '0.7rem', color: '#9CA3AF' }} />
              <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Secured by SSL encryption</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .cart-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
};

export default Cart;

