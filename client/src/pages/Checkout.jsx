import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MapPin, CreditCard, Banknote, ShieldCheck, Check, Loader2, ChevronRight, Star } from 'lucide-react';
import { selectCartItems, selectCartSubtotal, selectCartTotal, selectCartDiscount, clearCart } from '../redux/slices/cartSlice';
import API from '../utils/api';
import toast from 'react-hot-toast';

const STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh',
];

const loadRazorpay = () => new Promise(resolve => {
  if (window.Razorpay) { resolve(true); return; }
  const s = document.createElement('script');
  s.src = 'https://checkout.razorpay.com/v1/checkout.js';
  s.onload = () => resolve(true);
  s.onerror = () => resolve(false);
  document.head.appendChild(s);
});

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const items    = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const total    = useSelector(selectCartTotal);
  const discount = useSelector(selectCartDiscount);
  const { coupon } = useSelector(s => s.cart);
  const { user }   = useSelector(s => s.auth);
  const shipping   = subtotal > 500 ? 0 : 50;
  const tax        = Math.round(subtotal * 0.05);

  const savedAddresses = user?.addresses || [];
  const defaultAddr    = savedAddresses.find(a => a.isDefault) || savedAddresses[0];

  const [step,          setStep]          = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [loading,       setLoading]       = useState(false);

  // If user has saved addresses, pre-select default
  const [selectedAddrId, setSelectedAddrId] = useState(defaultAddr?._id || null);
  // New address form (only shown when no saved addresses)
  const [newAddr, setNewAddr] = useState({
    fullName: user?.name || '', phone: user?.phone || '',
    street: '', city: '', state: 'Karnataka', pincode: '', country: 'India',
  });

  const hasSaved    = savedAddresses.length > 0;
  const activeAddr  = hasSaved
    ? (savedAddresses.find(a => a._id === selectedAddrId) || defaultAddr)
    : newAddr;

  // Preload Razorpay SDK
  useEffect(() => { loadRazorpay(); }, []);

  const validateNewAddr = () => {
    const a = newAddr;
    if (!a.fullName) { toast.error('Name required'); return false; }
    if (!/^[6-9]\d{9}$/.test(a.phone)) { toast.error('Valid 10-digit phone required'); return false; }
    if (!a.street)   { toast.error('Street address required'); return false; }
    if (!a.city)     { toast.error('City required'); return false; }
    if (!a.state)    { toast.error('State required'); return false; }
    if (!/^\d{6}$/.test(a.pincode)) { toast.error('Valid 6-digit pincode required'); return false; }
    return true;
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const { data } = await API.post('/orders/create', {
        items: items.map(i => ({ product: i.product, quantity: i.quantity })),
        shippingAddress: activeAddr,
        paymentMethod,
        couponCode: coupon,
      });
      const orderId = data.order._id;

      if (paymentMethod === 'cod') {
        dispatch(clearCart());
        navigate(`/order-success/${orderId}`);
        return;
      }

      await loadRazorpay();
      const { data: payData } = await API.post('/payment/create-order', { orderId });

      const options = {
        key:         payData.key,
        amount:      payData.amount,
        currency:    payData.currency,
        name:        'GreenRoots Organics',
        description: 'Fresh Organic Products',
        order_id:    payData.razorpayOrderId,
        prefill:     { name: user.name, email: user.email, contact: user.phone },
        theme:       { color: '#2D6A4F' },
        handler: async (response) => {
          try {
            await API.post('/payment/verify', {
              razorpayOrderId:   response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              orderId,
            });
            dispatch(clearCart());
            navigate(`/order-success/${orderId}`);
          } catch {
            toast.error('Payment verification failed. Contact support.');
            setLoading(false);
          }
        },
        modal: { ondismiss: () => setLoading(false) },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => { toast.error('Payment failed. Try again.'); setLoading(false); });
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong. Retry.');
      setLoading(false);
    }
  };

  const steps = ['Address', 'Payment', 'Review'];

  return (
    <>
      <Helmet><title>Checkout — GreenRoots</title></Helmet>
      <div className="container" style={{ paddingTop: '28px', paddingBottom: '64px', maxWidth: '880px' }}>
        <h1 style={{ fontSize: '1.7rem', marginBottom: '24px', fontFamily: 'Playfair Display,serif' }}>Checkout</h1>

        {/* Step bar */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '28px' }}>
          {steps.map((s, i) => (
            <React.Fragment key={s}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem', background: i+1<=step ? '#2D6A4F' : '#E5E7EB', color: i+1<=step ? 'white' : '#9CA3AF', flexShrink: 0 }}>
                  {i+1 < step ? <Check size={13}/> : i+1}
                </div>
                <span style={{ fontWeight: i+1===step ? 700 : 400, color: i+1<=step ? '#2D6A4F' : '#9CA3AF', fontSize: '0.84rem', whiteSpace: 'nowrap' }}>{s}</span>
              </div>
              {i < steps.length-1 && <div style={{ flex: 1, height: '2px', background: i+1<step ? '#2D6A4F' : '#E5E7EB', margin: '0 8px' }}/>}
            </React.Fragment>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 290px', gap: '20px', alignItems: 'start' }} className="checkout-grid">

          {/* ── Main panel ── */}
          <div style={{ background: 'white', borderRadius: '16px', padding: 'clamp(16px,4vw,26px)', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6' }}>

            {/* STEP 1 — Address */}
            {step === 1 && (
              <>
                <h3 style={{ fontFamily: 'Inter,sans-serif', fontWeight: 700, marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem' }}>
                  <MapPin size={16} color="#2D6A4F"/> Delivery Address
                </h3>

                {hasSaved ? (
                  /* ── User has saved addresses — show picker only ── */
                  <>
                    {savedAddresses.length > 1 && (
                      <p style={{ fontSize: '0.8rem', color: '#6B7280', marginBottom: '12px' }}>Select a delivery address:</p>
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                      {savedAddresses.map(addr => (
                        <div key={addr._id} onClick={() => setSelectedAddrId(addr._id)}
                          style={{ display: 'flex', gap: '12px', padding: '14px 16px', border: `2px solid ${selectedAddrId===addr._id ? '#2D6A4F' : '#E5E7EB'}`, borderRadius: '12px', cursor: 'pointer', background: selectedAddrId===addr._id ? '#F0FDF4' : 'white', transition: 'all 0.18s', alignItems: 'flex-start' }}>
                          {/* Radio dot */}
                          <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid', borderColor: selectedAddrId===addr._id ? '#2D6A4F' : '#D1D5DB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                            {selectedAddrId===addr._id && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#2D6A4F' }}/>}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '3px' }}>
                              <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1B1B1B' }}>{addr.fullName}</span>
                              {addr.isDefault && (
                                <span style={{ background: '#D1FAE5', color: '#065F46', fontSize: '0.62rem', fontWeight: 700, padding: '1px 6px', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                  <Star size={8} fill="#065F46"/> Default
                                </span>
                              )}
                            </div>
                            <p style={{ fontSize: '0.81rem', color: '#6B7280', margin: 0, lineHeight: 1.6 }}>
                              {addr.street}, {addr.city}, {addr.state} — {addr.pincode}
                            </p>
                            <p style={{ fontSize: '0.77rem', color: '#9CA3AF', margin: '3px 0 0' }}>{addr.phone}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p style={{ fontSize: '0.78rem', color: '#9CA3AF', marginBottom: '16px' }}>
                      To add a new address, go to <a href="/profile" style={{ color: '#2D6A4F', fontWeight: 600 }}>My Profile → Addresses</a>
                    </p>
                  </>
                ) : (
                  /* ── No saved addresses — show form ── */
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div className="form-group">
                        <label className="form-label">Full Name *</label>
                        <input className="form-input" placeholder="Your name" value={newAddr.fullName}
                          onChange={e => setNewAddr(a => ({ ...a, fullName: e.target.value }))}/>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Phone *</label>
                        <input className="form-input" placeholder="10-digit" value={newAddr.phone}
                          onChange={e => setNewAddr(a => ({ ...a, phone: e.target.value.replace(/\D/g,'').slice(0,10) }))}/>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Street / Area *</label>
                      <textarea className="form-input" placeholder="House no., street, area, landmark..." value={newAddr.street}
                        style={{ minHeight: '64px', resize: 'vertical' }}
                        onChange={e => setNewAddr(a => ({ ...a, street: e.target.value }))}/>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div className="form-group">
                        <label className="form-label">City *</label>
                        <input className="form-input" placeholder="City" value={newAddr.city}
                          onChange={e => setNewAddr(a => ({ ...a, city: e.target.value }))}/>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Pincode *</label>
                        <input className="form-input" placeholder="6-digit" value={newAddr.pincode}
                          onChange={e => setNewAddr(a => ({ ...a, pincode: e.target.value.replace(/\D/g,'').slice(0,6) }))}/>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">State *</label>
                      <select className="form-input" value={newAddr.state}
                        onChange={e => setNewAddr(a => ({ ...a, state: e.target.value }))}>
                        {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </>
                )}

                <button
                  onClick={() => {
                    if (!hasSaved && !validateNewAddr()) return;
                    setStep(2);
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '12px 22px', background: '#2D6A4F', color: 'white', border: 'none', borderRadius: '9px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontSize: '0.9rem' }}>
                  Continue <ChevronRight size={15}/>
                </button>
              </>
            )}

            {/* STEP 2 — Payment */}
            {step === 2 && (
              <>
                <h3 style={{ fontFamily: 'Inter,sans-serif', fontWeight: 700, marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem' }}>
                  <CreditCard size={16} color="#2D6A4F"/> Payment Method
                </h3>
                {[
                  { v: 'razorpay', Icon: CreditCard, label: 'Online Payment',   desc: 'UPI · Card · Net Banking · Wallet' },
                  { v: 'cod',      Icon: Banknote,   label: 'Cash on Delivery', desc: 'Pay when your order arrives'       },
                ].map(({ v, Icon, label, desc }) => (
                  <div key={v} onClick={() => setPaymentMethod(v)}
                    style={{ display: 'flex', gap: '14px', padding: '14px', border: `2px solid ${paymentMethod===v ? '#2D6A4F' : '#E5E7EB'}`, borderRadius: '12px', marginBottom: '10px', cursor: 'pointer', background: paymentMethod===v ? '#F0FDF4' : 'white', transition: 'all 0.18s', alignItems: 'center' }}>
                    <div style={{ background: paymentMethod===v ? '#D1FAE5' : '#F3F4F6', borderRadius: '9px', padding: '9px', flexShrink: 0 }}>
                      <Icon size={18} color={paymentMethod===v ? '#2D6A4F' : '#9CA3AF'}/>
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 700, fontSize: '0.9rem', margin: 0 }}>{label}</p>
                      <p style={{ color: '#9CA3AF', fontSize: '0.78rem', margin: '2px 0 0' }}>{desc}</p>
                    </div>
                    <div style={{ width: '19px', height: '19px', borderRadius: '50%', border: '2px solid', borderColor: paymentMethod===v ? '#2D6A4F' : '#D1D5DB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {paymentMethod===v && <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#2D6A4F' }}/>}
                    </div>
                  </div>
                ))}
                <div style={{ display: 'flex', gap: '10px', marginTop: '18px' }}>
                  <button onClick={() => setStep(1)} style={{ padding: '11px 18px', background: 'none', border: '1.5px solid #E5E7EB', borderRadius: '9px', cursor: 'pointer', fontWeight: 600, color: '#6B7280', fontFamily: 'Inter,sans-serif' }}>← Back</button>
                  <button onClick={() => setStep(3)} style={{ flex: 1, padding: '11px', background: '#2D6A4F', color: 'white', border: 'none', borderRadius: '9px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter,sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px' }}>
                    Review Order <ChevronRight size={14}/>
                  </button>
                </div>
              </>
            )}

            {/* STEP 3 — Review */}
            {step === 3 && (
              <>
                <h3 style={{ fontFamily: 'Inter,sans-serif', fontWeight: 700, marginBottom: '18px', fontSize: '0.95rem' }}>Review Order</h3>

                {/* Address summary */}
                <div style={{ background: '#F8FFF4', border: '1px solid #D1FAE5', borderRadius: '10px', padding: '13px 15px', marginBottom: '12px' }}>
                  <p style={{ fontWeight: 700, fontSize: '0.75rem', color: '#2D6A4F', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={11}/> DELIVERY TO
                  </p>
                  <p style={{ color: '#1B1B1B', fontSize: '0.87rem', fontWeight: 600, margin: 0 }}>{activeAddr.fullName} · {activeAddr.phone}</p>
                  <p style={{ color: '#6B7280', fontSize: '0.81rem', margin: '3px 0 0', lineHeight: 1.6 }}>
                    {activeAddr.street}, {activeAddr.city}, {activeAddr.state} — {activeAddr.pincode}
                  </p>
                </div>

                {/* Items */}
                <div style={{ background: '#F9FAFB', borderRadius: '10px', padding: '13px 15px', marginBottom: '18px' }}>
                  <p style={{ fontWeight: 700, fontSize: '0.75rem', color: '#374151', marginBottom: '10px' }}>ITEMS ({items.length})</p>
                  {items.map(item => (
                    <div key={item.product} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                      <img src={item.image||'/placeholder.jpg'} alt={item.name} style={{ width: '42px', height: '42px', objectFit: 'cover', borderRadius: '7px', background: '#F3F4F6', flexShrink: 0 }}/>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 600, fontSize: '0.85rem', margin: 0 }}>{item.name}</p>
                        <p style={{ color: '#9CA3AF', fontSize: '0.75rem', margin: '2px 0 0' }}>Qty: {item.quantity} × ₹{item.price}</p>
                      </div>
                      <span style={{ fontWeight: 700, color: '#2D6A4F', fontSize: '0.88rem' }}>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => setStep(2)} style={{ padding: '11px 18px', background: 'none', border: '1.5px solid #E5E7EB', borderRadius: '9px', cursor: 'pointer', fontWeight: 600, color: '#6B7280', fontFamily: 'Inter,sans-serif' }}>← Back</button>
                  <button onClick={handlePlaceOrder} disabled={loading}
                    style={{ flex: 1, padding: '12px', background: '#2D6A4F', color: 'white', border: 'none', borderRadius: '9px', fontWeight: 700, fontSize: '0.93rem', cursor: loading?'not-allowed':'pointer', fontFamily: 'Inter,sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', opacity: loading?0.75:1 }}>
                    {loading
                      ? <><Loader2 size={15} style={{ animation:'spin 1s linear infinite' }}/> Opening payment...</>
                      : paymentMethod==='cod'
                        ? <><Check size={14}/> Place Order</>
                        : <><CreditCard size={14}/> Pay ₹{total}</>
                    }
                  </button>
                </div>
              </>
            )}
          </div>

          {/* ── Order summary sidebar ── */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '18px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', position: 'sticky', top: '80px', border: '1px solid #F3F4F6' }}>
            <p style={{ fontWeight: 700, fontSize: '0.78rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px' }}>Order Summary</p>
            {[
              ['Subtotal', `₹${subtotal}`],
              ['Delivery', shipping===0 ? 'FREE' : `₹${shipping}`],
              ['Tax (5%)', `₹${tax}`],
              ...(discount>0 ? [['Discount', `-₹${discount}`]] : []),
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '9px', fontSize: '0.85rem', color: '#374151' }}>
                <span>{label}</span>
                <span style={{ fontWeight: 500, color: value==='FREE'||value.startsWith('-') ? '#22C55E' : 'inherit' }}>{value}</span>
              </div>
            ))}
            <div style={{ borderTop: '2px solid #F3F4F6', paddingTop: '11px', display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1rem', marginBottom: '14px' }}>
              <span>Total</span><span style={{ color: '#2D6A4F' }}>₹{total}</span>
            </div>
            <div style={{ background: '#F0FDF4', borderRadius: '8px', padding: '9px 11px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={13} color="#2D6A4F"/>
              <p style={{ fontSize: '0.73rem', color: '#065F46', margin: 0 }}>SSL secured checkout</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 720px) {
          .checkout-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
};

export default Checkout;
