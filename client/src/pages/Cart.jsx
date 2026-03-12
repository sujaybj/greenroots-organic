import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { removeFromCart, updateQuantity, applyCoupon, removeCoupon, selectCartSubtotal, selectCartTotal, selectCartDiscount, selectCartCoupon } from '../redux/slices/cartSlice';
import API from '../utils/api';
import toast from 'react-hot-toast';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector(s => s.cart);
  const { isAuthenticated } = useSelector(s => s.auth);
  const subtotal = useSelector(selectCartSubtotal);
  const total = useSelector(selectCartTotal);
  const discount = useSelector(selectCartDiscount);
  const coupon = useSelector(selectCartCoupon);
  const shipping = subtotal > 500 ? 0 : 50;
  const tax = Math.round(subtotal * 0.05);
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) { toast.error('Enter a coupon code'); return; }
    if (!isAuthenticated) { toast.error('Please login to apply coupons'); return; }
    setCouponLoading(true);
    try {
      const { data } = await API.post('/cart/apply-coupon', { code: couponCode, orderAmount: subtotal });
      dispatch(applyCoupon({ couponCode: data.couponCode, discount: data.discount }));
      setCouponCode('');
    } catch {} finally { setCouponLoading(false); }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) { toast.error('Please login to checkout'); navigate('/login'); return; }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', padding: '40px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: 'clamp(56px,15vw,80px)' }}>🛒</div>
        <h2 style={{ fontSize: 'clamp(1.3rem,4vw,1.8rem)', color: '#374151' }}>Your cart is empty</h2>
        <p style={{ color: '#9CA3AF', maxWidth: '300px' }}>Looks like you haven't added anything to your cart yet.</p>
        <Link to="/products" className="btn btn-primary btn-lg">Start Shopping</Link>
      </div>
    );
  }

  return (
    <>
      <Helmet><title>My Cart - GreenRoots Organics</title></Helmet>
      <div className="container" style={{ paddingTop: '28px', paddingBottom: '56px' }}>
        <h1 style={{ fontSize: 'clamp(1.5rem,4vw,2rem)', marginBottom: '24px' }}>
          My Cart <span style={{ fontSize: '1rem', color: '#6B7280', fontFamily: 'Inter,sans-serif', fontWeight: 400 }}>({items.length} items)</span>
        </h1>

        {/* Responsive layout: side-by-side on desktop, stacked on mobile */}
        <div className="layout-sidebar">
          {/* Cart Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {items.map(item => (
              <div key={item.product} style={{ background: 'white', borderRadius: '12px', padding: 'clamp(12px,3vw,16px)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <Link to={`/products/${item.product}`} style={{ flexShrink: 0 }}>
                  <img src={item.image||'/placeholder.jpg'} alt={item.name} style={{ width: 'clamp(64px,15vw,88px)', height: 'clamp(64px,15vw,88px)', objectFit: 'cover', borderRadius: '8px' }} />
                </Link>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Link to={`/products/${item.product}`} style={{ fontWeight: 600, fontSize: 'clamp(0.85rem,2vw,0.95rem)', color: '#1B1B1B', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</Link>
                  <p style={{ color: '#6B7280', fontSize: '0.82rem', marginTop: '2px' }}>₹{item.price}/{item.unit}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                    {/* Qty stepper */}
                    <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden' }}>
                      <button onClick={() => dispatch(updateQuantity({ productId: item.product, quantity: item.quantity - 1 }))}
                        style={{ width: '34px', height: '34px', border: 'none', background: '#F9FAFB', cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                      <span style={{ padding: '0 12px', fontWeight: 600, fontSize: '0.95rem' }}>{item.quantity}</span>
                      <button onClick={() => dispatch(updateQuantity({ productId: item.product, quantity: item.quantity + 1 }))}
                        style={{ width: '34px', height: '34px', border: 'none', background: '#F9FAFB', cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                    </div>
                    <span style={{ fontWeight: 700, color: '#2D6A4F', fontSize: 'clamp(0.95rem,2vw,1rem)' }}>₹{item.price * item.quantity}</span>
                  </div>
                </div>
                <button onClick={() => dispatch(removeFromCart(item.product))}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', fontSize: '1.1rem', padding: '4px', flexShrink: 0 }}>🗑️</button>
              </div>
            ))}

            {/* Continue shopping */}
            <Link to="/products" style={{ color: '#2D6A4F', fontSize: '0.9rem', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
              ← Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="sidebar-sticky" style={{ background: 'white', borderRadius: '16px', padding: 'clamp(18px,4vw,24px)', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', position: 'sticky', top: '80px' }}>
            <h3 style={{ fontSize: '1.05rem', marginBottom: '18px', fontFamily: 'Inter,sans-serif', fontWeight: 700 }}>Order Summary</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '11px', marginBottom: '18px' }}>
              {[['Subtotal', `₹${subtotal}`], ['Shipping', shipping === 0 ? '🎉 FREE' : `₹${shipping}`], ['Tax (5%)', `₹${tax}`]].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#374151' }}>
                  <span>{label}</span>
                  <span style={{ fontWeight: 500, color: value.includes('FREE') ? '#22C55E' : 'inherit' }}>{value}</span>
                </div>
              ))}
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#22C55E' }}>
                  <span>Coupon Discount</span><span>−₹{discount}</span>
                </div>
              )}
              <div style={{ borderTop: '1.5px solid #E5E7EB', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.05rem' }}>
                <span>Total</span><span style={{ color: '#2D6A4F' }}>₹{total}</span>
              </div>
            </div>

            {/* Coupon */}
            {coupon ? (
              <div style={{ background: '#D1FAE5', borderRadius: '8px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#065F46' }}>🎟️ {coupon} applied!</span>
                <button onClick={() => dispatch(removeCoupon())} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '1.2rem', lineHeight: 1 }}>×</button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                <input className="form-input" placeholder="Coupon code" value={couponCode}
                  onChange={e => setCouponCode(e.target.value.toUpperCase())}
                  style={{ flex: 1, padding: '10px 12px', minHeight: '44px' }} />
                <button onClick={handleApplyCoupon} disabled={couponLoading} className="btn btn-outline btn-sm">Apply</button>
              </div>
            )}

            <button onClick={handleCheckout} className="btn btn-primary btn-full btn-lg">
              Proceed to Checkout →
            </button>

            {shipping > 0 && (
              <p style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.78rem', color: '#6B7280' }}>
                Add ₹{500 - subtotal} more for FREE delivery 🚚
              </p>
            )}

            <div style={{ marginTop: '14px', textAlign: 'center' }}>
              <p style={{ fontSize: '0.76rem', color: '#9CA3AF' }}>🔒 SSL Secured Checkout</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Cart;
