import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { selectCartItems, selectCartSubtotal, selectCartTotal, selectCartDiscount, clearCart } from '../redux/slices/cartSlice';
import API from '../utils/api';
import toast from 'react-hot-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const total = useSelector(selectCartTotal);
  const discount = useSelector(selectCartDiscount);
  const { coupon } = useSelector(s => s.cart);
  const { user } = useSelector(s => s.auth);
  const shipping = subtotal > 500 ? 0 : 50;
  const tax = Math.round(subtotal * 0.05);

  const [address, setAddress] = useState({ fullName: user?.name||'', phone: user?.phone||'', street: '', city: '', state: '', pincode: '', country: 'India' });
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const { data } = await API.post('/orders/create', {
        items: items.map(i => ({ product: i.product, quantity: i.quantity })),
        shippingAddress: address, paymentMethod, couponCode: coupon,
      });
      const orderId = data.order._id;
      if (paymentMethod === 'razorpay') {
        const { data: payData } = await API.post('/payment/create-order', { orderId });
        const options = {
          key: payData.key, amount: payData.amount, currency: payData.currency,
          name: 'GreenRoots Organics', description: 'Organic Products Payment',
          order_id: payData.razorpayOrderId,
          prefill: { name: user.name, email: user.email, contact: user.phone },
          theme: { color: '#2D6A4F' },
          handler: async (response) => {
            try {
              await API.post('/payment/verify', { razorpayOrderId: response.razorpay_order_id, razorpayPaymentId: response.razorpay_payment_id, razorpaySignature: response.razorpay_signature, orderId });
              dispatch(clearCart()); navigate(`/order-success/${orderId}`);
            } catch { toast.error('Payment verification failed. Contact support.'); }
          },
          modal: { ondismiss: () => { setLoading(false); toast.error('Payment cancelled'); } },
        };
        const loadRazorpay = () => {
          if (window.Razorpay) { new window.Razorpay(options).open(); }
          else {
            const s = document.createElement('script'); s.src = 'https://checkout.razorpay.com/v1/checkout.js';
            s.onload = () => new window.Razorpay(options).open(); document.body.appendChild(s);
          }
        };
        loadRazorpay();
      } else {
        dispatch(clearCart()); navigate(`/order-success/${orderId}`);
      }
    } catch { setLoading(false); }
  };

  const steps = ['Address', 'Payment', 'Review'];

  // Order Summary sidebar — reused in both desktop and mobile
  const OrderSummary = () => (
    <div style={{ background: 'white', borderRadius: '16px', padding: 'clamp(16px,4vw,24px)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
      <h3 style={{ fontFamily: 'Inter,sans-serif', fontWeight: 700, marginBottom: '14px', fontSize: '1rem' }}>Order Summary</h3>
      {[['Subtotal',`₹${subtotal}`],['Shipping',shipping===0?'FREE 🎉':`₹${shipping}`],['Tax (5%)',`₹${tax}`],...(discount>0?[['Discount',`−₹${discount}`]]:[])].map(([l,v]) => (
        <div key={l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '9px', fontSize: '0.88rem', color: '#374151' }}>
          <span>{l}</span><span style={{ color: v.includes('FREE')||v.startsWith('−')?'#22C55E':'inherit', fontWeight: 500 }}>{v}</span>
        </div>
      ))}
      <div style={{ borderTop: '1.5px solid #E5E7EB', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.05rem' }}>
        <span>Total</span><span style={{ color: '#2D6A4F' }}>₹{total}</span>
      </div>
      <div style={{ background: '#F0FDF4', borderRadius: '8px', padding: '10px', marginTop: '14px', textAlign: 'center' }}>
        <p style={{ fontSize: '0.78rem', color: '#065F46' }}>🔒 SSL Secured Checkout</p>
      </div>
    </div>
  );

  return (
    <>
      <Helmet><title>Checkout - GreenRoots</title></Helmet>
      <div className="container" style={{ paddingTop: '28px', paddingBottom: '56px', maxWidth: '960px' }}>
        <h1 style={{ fontSize: 'clamp(1.5rem,4vw,2rem)', marginBottom: '24px' }}>Checkout</h1>

        {/* Step Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '28px' }}>
          {steps.map((s, i) => (
            <React.Fragment key={s}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.82rem', background: i+1<=step?'#2D6A4F':'#E5E7EB', color: i+1<=step?'white':'#9CA3AF', flexShrink: 0 }}>
                  {i+1<step?'✓':i+1}
                </div>
                <span className="hide-small" style={{ fontWeight: i+1===step?700:400, color: i+1<=step?'#2D6A4F':'#9CA3AF', fontSize: '0.88rem', whiteSpace: 'nowrap' }}>{s}</span>
              </div>
              {i<steps.length-1 && <div style={{ flex: 1, height: '2px', background: i+1<step?'#2D6A4F':'#E5E7EB', margin: '0 6px' }} />}
            </React.Fragment>
          ))}
        </div>

        {/* Responsive 2-col layout */}
        <div className="layout-sidebar">
          {/* Main Form */}
          <div style={{ background: 'white', borderRadius: '16px', padding: 'clamp(18px,4vw,28px)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>

            {/* Step 1 - Address */}
            {step === 1 && (
              <>
                <h3 style={{ fontFamily: 'Inter,sans-serif', fontWeight: 700, marginBottom: '18px' }}>Delivery Address</h3>
                <div className="grid-2col">
                  {[['fullName','Full Name *','text','John Doe'],['phone','Phone Number *','tel','+91 9876543210']].map(([key,label,type,ph]) => (
                    <div key={key} className="form-group">
                      <label className="form-label">{label}</label>
                      <input type={type} className="form-input" placeholder={ph} value={address[key]} onChange={e => setAddress({...address,[key]:e.target.value})} />
                    </div>
                  ))}
                </div>
                <div className="form-group">
                  <label className="form-label">Street Address *</label>
                  <input className="form-input" placeholder="123 Main Street, Koramangala" value={address.street} onChange={e => setAddress({...address,street:e.target.value})} />
                </div>
                <div className="grid-3col">
                  {[['city','City *','Bangalore'],['state','State *','Karnataka'],['pincode','Pincode *','560034']].map(([key,label,ph]) => (
                    <div key={key} className="form-group">
                      <label className="form-label">{label}</label>
                      <input className="form-input" placeholder={ph} value={address[key]} onChange={e => setAddress({...address,[key]:e.target.value})} />
                    </div>
                  ))}
                </div>
                <button onClick={() => {
                  if (!address.fullName||!address.phone||!address.street||!address.city||!address.state||!address.pincode) { toast.error('Please fill all required fields'); return; }
                  setStep(2);
                }} className="btn btn-primary btn-lg mobile-full">Continue to Payment →</button>
              </>
            )}

            {/* Step 2 - Payment */}
            {step === 2 && (
              <>
                <h3 style={{ fontFamily: 'Inter,sans-serif', fontWeight: 700, marginBottom: '18px' }}>Payment Method</h3>
                {[['razorpay','💳','Razorpay','Pay with UPI, Card, Net Banking, Wallet'],['cod','💵','Cash on Delivery','Pay when you receive your order']].map(([value,icon,label,desc]) => (
                  <div key={value} onClick={() => setPaymentMethod(value)}
                    style={{ display: 'flex', gap: '14px', padding: 'clamp(12px,3vw,16px)', border: `2px solid ${paymentMethod===value?'#2D6A4F':'#E5E7EB'}`, borderRadius: '12px', marginBottom: '12px', cursor: 'pointer', background: paymentMethod===value?'#F0FDF4':'white', transition: 'all 0.2s', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '1.6rem', flexShrink: 0 }}>{icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 700, fontSize: 'clamp(0.9rem,2vw,1rem)' }}>{label}</p>
                      <p style={{ color: '#6B7280', fontSize: 'clamp(0.78rem,2vw,0.85rem)', marginTop: '3px' }}>{desc}</p>
                    </div>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid', borderColor: paymentMethod===value?'#2D6A4F':'#E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                      {paymentMethod===value && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#2D6A4F' }} />}
                    </div>
                  </div>
                ))}
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
                  <button onClick={() => setStep(1)} className="btn btn-outline">← Back</button>
                  <button onClick={() => setStep(3)} className="btn btn-primary btn-lg" style={{ flex: 1 }}>Review Order →</button>
                </div>
              </>
            )}

            {/* Step 3 - Review */}
            {step === 3 && (
              <>
                <h3 style={{ fontFamily: 'Inter,sans-serif', fontWeight: 700, marginBottom: '18px' }}>Review Your Order</h3>
                <div style={{ background: '#F9FAFB', borderRadius: '10px', padding: '14px', marginBottom: '16px' }}>
                  <h4 style={{ fontFamily: 'Inter,sans-serif', fontWeight: 600, marginBottom: '6px', fontSize: '0.88rem' }}>📍 Delivery Address</h4>
                  <p style={{ color: '#374151', fontSize: '0.88rem' }}>{address.fullName} • {address.phone}</p>
                  <p style={{ color: '#6B7280', fontSize: '0.84rem' }}>{address.street}, {address.city}, {address.state} - {address.pincode}</p>
                </div>
                <div style={{ background: '#F9FAFB', borderRadius: '10px', padding: '14px', marginBottom: '16px' }}>
                  <h4 style={{ fontFamily: 'Inter,sans-serif', fontWeight: 600, marginBottom: '10px', fontSize: '0.88rem' }}>🛒 Items ({items.length})</h4>
                  <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
                    {items.map(item => (
                      <div key={item.product} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                        <img src={item.image} alt={item.name} style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontWeight: 600, fontSize: '0.88rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                          <p style={{ color: '#6B7280', fontSize: '0.78rem' }}>Qty: {item.quantity} × ₹{item.price}</p>
                        </div>
                        <span style={{ fontWeight: 700, color: '#2D6A4F', fontSize: '0.9rem', flexShrink: 0 }}>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button onClick={() => setStep(2)} className="btn btn-outline">← Back</button>
                  <button onClick={handlePlaceOrder} disabled={loading} className="btn btn-primary btn-lg" style={{ flex: 1 }}>
                    {loading ? '⏳ Processing...' : paymentMethod==='cod' ? '✓ Place Order' : '💳 Pay Now'}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="sidebar-sticky" style={{ position: 'sticky', top: '80px' }}>
            <OrderSummary />
          </div>
        </div>
      </div>
    </>
  );
};
export default Checkout;
