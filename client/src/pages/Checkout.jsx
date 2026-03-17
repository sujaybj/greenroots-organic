import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MapPin, CreditCard, Banknote, ShieldCheck, Check, Loader2, ChevronRight } from 'lucide-react';
import { selectCartItems, selectCartSubtotal, selectCartTotal, selectCartDiscount, clearCart } from '../redux/slices/cartSlice';
import API from '../utils/api';
import toast from 'react-hot-toast';

// ── Preload Razorpay SDK immediately on component mount ───────
const loadRazorpay = () => new Promise((resolve) => {
  if (window.Razorpay) { resolve(true); return; }
  const s = document.createElement('script');
  s.src = 'https://checkout.razorpay.com/v1/checkout.js';
  s.onload  = () => resolve(true);
  s.onerror = () => resolve(false);
  document.head.appendChild(s);
});

const STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh',
];

const Checkout = () => {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const items     = useSelector(selectCartItems);
  const subtotal  = useSelector(selectCartSubtotal);
  const total     = useSelector(selectCartTotal);
  const discount  = useSelector(selectCartDiscount);
  const { coupon } = useSelector(s => s.cart);
  const { user }   = useSelector(s => s.auth);
  const shipping   = subtotal > 500 ? 0 : 50;
  const tax        = Math.round(subtotal * 0.05);

  const [step,          setStep]          = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [loading,       setLoading]       = useState(false);
  const [address, setAddress] = useState({
    fullName: user?.name || '', phone: user?.phone || '',
    street: '', city: '', state: 'Karnataka', pincode: '', country: 'India',
  });

  // ── Preload Razorpay as soon as page loads ────────────────
  useEffect(() => { loadRazorpay(); }, []);

  const validateAddress = () => {
    if (!address.fullName) { toast.error('Full name is required'); return false; }
    if (!address.phone || !/^[6-9]\d{9}$/.test(address.phone)) { toast.error('Valid 10-digit phone required'); return false; }
    if (!address.street)  { toast.error('Street address is required'); return false; }
    if (!address.city)    { toast.error('City is required'); return false; }
    if (!address.state)   { toast.error('State is required'); return false; }
    if (!address.pincode || !/^\d{6}$/.test(address.pincode)) { toast.error('Valid 6-digit pincode required'); return false; }
    return true;
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      // Step 1: Create order
      const { data } = await API.post('/orders/create', {
        items: items.map(i => ({ product: i.product, quantity: i.quantity })),
        shippingAddress: address,
        paymentMethod,
        couponCode: coupon,
      });
      const orderId = data.order._id;

      if (paymentMethod === 'cod') {
        dispatch(clearCart());
        navigate(`/order-success/${orderId}`);
        return;
      }

      // Step 2: Ensure Razorpay is loaded (already preloaded)
      await loadRazorpay();

      // Step 3: Create Razorpay order
      const { data: payData } = await API.post('/payment/create-order', { orderId });

      // Step 4: Open Razorpay immediately
      const options = {
        key:         payData.key,
        amount:      payData.amount,
        currency:    payData.currency,
        name:        'GreenRoots Organics',
        description: 'Organic Products',
        order_id:    payData.razorpayOrderId,
        prefill:     { name: user.name, email: user.email, contact: user.phone },
        theme:       { color: '#2D6A4F' },
        handler: async (response) => {
          try {
            await API.post('/payment/verify', {
              razorpayOrderId:    response.razorpay_order_id,
              razorpayPaymentId:  response.razorpay_payment_id,
              razorpaySignature:  response.razorpay_signature,
              orderId,
            });
            dispatch(clearCart());
            navigate(`/order-success/${orderId}`);
          } catch {
            toast.error('Payment verification failed. Contact support.');
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => { setLoading(false); },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => {
        toast.error('Payment failed. Please try again.');
        setLoading(false);
      });
      rzp.open();

    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong. Please retry.');
      setLoading(false);
    }
  };

  const steps = ['Address', 'Payment', 'Review'];

  return (
    <>
      <Helmet><title>Checkout — GreenRoots</title></Helmet>
      <div className="container" style={{ paddingTop: '32px', paddingBottom: '64px', maxWidth: '900px' }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '28px', fontFamily: 'Playfair Display, serif' }}>Checkout</h1>

        {/* Step bar */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
          {steps.map((s, i) => (
            <React.Fragment key={s}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.82rem', background: i+1 <= step ? '#2D6A4F' : '#E5E7EB', color: i+1 <= step ? 'white' : '#9CA3AF', flexShrink: 0 }}>
                  {i+1 < step ? <Check size={13}/> : i+1}
                </div>
                <span style={{ fontWeight: i+1 === step ? 700 : 400, color: i+1 <= step ? '#2D6A4F' : '#9CA3AF', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>{s}</span>
              </div>
              {i < steps.length-1 && <div style={{ flex: 1, height: '2px', background: i+1 < step ? '#2D6A4F' : '#E5E7EB', margin: '0 8px' }}/>}
            </React.Fragment>
          ))}
        </div>

        {/* ── Grid: form + summary ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px', alignItems: 'start' }}
          className="checkout-grid">

          {/* ── Main panel ── */}
          <div style={{ background: 'white', borderRadius: '16px', padding: 'clamp(18px,4vw,28px)', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6' }}>

            {/* STEP 1 — Address */}
            {step === 1 && (
              <>
                <h3 style={{ fontFamily: 'Inter,sans-serif', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={16} color="#2D6A4F"/> Delivery Address
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input className="form-input" placeholder="Your name" value={address.fullName}
                      onChange={e => setAddress(a => ({ ...a, fullName: e.target.value }))}/>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone *</label>
                    <input className="form-input" placeholder="10-digit number" value={address.phone}
                      onChange={e => setAddress(a => ({ ...a, phone: e.target.value.replace(/\D/g,'').slice(0,10) }))}/>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Street / Area *</label>
                  <textarea className="form-input" placeholder="House no., street, area, landmark..." value={address.street}
                    style={{ minHeight: '68px', resize: 'vertical' }}
                    onChange={e => setAddress(a => ({ ...a, street: e.target.value }))}/>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input className="form-input" placeholder="City or town" value={address.city}
                      onChange={e => setAddress(a => ({ ...a, city: e.target.value }))}/>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Pincode *</label>
                    <input className="form-input" placeholder="6-digit pincode" value={address.pincode}
                      onChange={e => setAddress(a => ({ ...a, pincode: e.target.value.replace(/\D/g,'').slice(0,6) }))}/>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">State *</label>
                  <select className="form-input" value={address.state}
                    onChange={e => setAddress(a => ({ ...a, state: e.target.value }))}>
                    {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <button onClick={() => validateAddress() && setStep(2)}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '13px 24px', background: '#2D6A4F', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontSize: '0.92rem' }}>
                  Continue <ChevronRight size={15}/>
                </button>
              </>
            )}

            {/* STEP 2 — Payment */}
            {step === 2 && (
              <>
                <h3 style={{ fontFamily: 'Inter,sans-serif', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CreditCard size={16} color="#2D6A4F"/> Payment Method
                </h3>
                {[
                  { v: 'razorpay', Icon: CreditCard, label: 'Online Payment',    desc: 'UPI · Card · Net Banking · Wallet' },
                  { v: 'cod',      Icon: Banknote,   label: 'Cash on Delivery',  desc: 'Pay when your order arrives'        },
                ].map(({ v, Icon, label, desc }) => (
                  <div key={v} onClick={() => setPaymentMethod(v)}
                    style={{ display: 'flex', gap: '14px', padding: '16px', border: `2px solid ${paymentMethod === v ? '#2D6A4F' : '#E5E7EB'}`, borderRadius: '12px', marginBottom: '12px', cursor: 'pointer', background: paymentMethod === v ? '#F0FDF4' : 'white', transition: 'all 0.2s', alignItems: 'center' }}>
                    <div style={{ background: paymentMethod === v ? '#D1FAE5' : '#F3F4F6', borderRadius: '10px', padding: '10px', flexShrink: 0 }}>
                      <Icon size={20} color={paymentMethod === v ? '#2D6A4F' : '#9CA3AF'}/>
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 700, fontSize: '0.93rem', margin: 0 }}>{label}</p>
                      <p style={{ color: '#6B7280', fontSize: '0.8rem', margin: '3px 0 0' }}>{desc}</p>
                    </div>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid', borderColor: paymentMethod === v ? '#2D6A4F' : '#D1D5DB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {paymentMethod === v && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#2D6A4F' }}/>}
                    </div>
                  </div>
                ))}
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                  <button onClick={() => setStep(1)} style={{ padding: '12px 20px', background: 'none', border: '1.5px solid #E5E7EB', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, color: '#6B7280', fontFamily: 'Inter,sans-serif' }}>← Back</button>
                  <button onClick={() => setStep(3)} style={{ flex: 1, padding: '12px', background: '#2D6A4F', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter,sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px' }}>
                    Review Order <ChevronRight size={15}/>
                  </button>
                </div>
              </>
            )}

            {/* STEP 3 — Review + Place Order */}
            {step === 3 && (
              <>
                <h3 style={{ fontFamily: 'Inter,sans-serif', fontWeight: 700, marginBottom: '20px' }}>Review Your Order</h3>

                {/* Address summary */}
                <div style={{ background: '#F8FFF4', border: '1px solid #D1FAE5', borderRadius: '10px', padding: '14px 16px', marginBottom: '14px' }}>
                  <p style={{ fontWeight: 700, fontSize: '0.78rem', color: '#2D6A4F', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <MapPin size={11}/> DELIVERY ADDRESS
                  </p>
                  <p style={{ color: '#1B1B1B', fontSize: '0.88rem', fontWeight: 600, margin: 0 }}>{address.fullName} · {address.phone}</p>
                  <p style={{ color: '#6B7280', fontSize: '0.83rem', margin: '3px 0 0', lineHeight: 1.6 }}>
                    {address.street}, {address.city}, {address.state} — {address.pincode}
                  </p>
                </div>

                {/* Items */}
                <div style={{ background: '#F9FAFB', borderRadius: '10px', padding: '14px 16px', marginBottom: '20px' }}>
                  <p style={{ fontWeight: 700, fontSize: '0.78rem', color: '#374151', marginBottom: '10px' }}>ITEMS ({items.length})</p>
                  {items.map(item => (
                    <div key={item.product} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                      <img src={item.image || '/placeholder.jpg'} alt={item.name}
                        style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '7px', background: '#F3F4F6' }}/>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 600, fontSize: '0.87rem', margin: 0 }}>{item.name}</p>
                        <p style={{ color: '#9CA3AF', fontSize: '0.76rem', margin: '2px 0 0' }}>Qty: {item.quantity} × ₹{item.price}</p>
                      </div>
                      <span style={{ fontWeight: 700, color: '#2D6A4F', fontSize: '0.9rem' }}>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => setStep(2)} style={{ padding: '12px 20px', background: 'none', border: '1.5px solid #E5E7EB', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, color: '#6B7280', fontFamily: 'Inter,sans-serif' }}>← Back</button>
                  <button onClick={handlePlaceOrder} disabled={loading}
                    style={{ flex: 1, padding: '13px', background: '#2D6A4F', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Inter,sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: loading ? 0.75 : 1 }}>
                    {loading
                      ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }}/> Opening payment...</>
                      : paymentMethod === 'cod'
                        ? <><Check size={15}/> Place Order</>
                        : <><CreditCard size={15}/> Pay ₹{total}</>
                    }
                  </button>
                </div>
              </>
            )}
          </div>

          {/* ── Order Summary sidebar ── */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', position: 'sticky', top: '80px', border: '1px solid #F3F4F6' }}>
            <h3 style={{ fontFamily: 'Inter,sans-serif', fontWeight: 700, marginBottom: '16px', fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6B7280' }}>Order Summary</h3>
            {[
              ['Subtotal', `₹${subtotal}`],
              ['Delivery', shipping === 0 ? 'FREE' : `₹${shipping}`],
              ['Tax (5%)', `₹${tax}`],
              ...(discount > 0 ? [['Discount', `-₹${discount}`]] : []),
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.87rem', color: '#374151' }}>
                <span>{label}</span>
                <span style={{ fontWeight: 500, color: value === 'FREE' || value.startsWith('-') ? '#22C55E' : 'inherit' }}>{value}</span>
              </div>
            ))}
            <div style={{ borderTop: '2px solid #F3F4F6', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.05rem', marginBottom: '14px' }}>
              <span>Total</span><span style={{ color: '#2D6A4F' }}>₹{total}</span>
            </div>
            <div style={{ background: '#F0FDF4', borderRadius: '8px', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '7px' }}>
              <ShieldCheck size={14} color="#2D6A4F"/>
              <p style={{ fontSize: '0.75rem', color: '#065F46', margin: 0 }}>SSL secured checkout</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .checkout-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
};

export default Checkout;
