import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Plus, Check, CreditCard, Banknote,
  ShieldCheck, Package, ChevronRight, Loader2, Star,
} from 'lucide-react';
import {
  selectCartItems, selectCartSubtotal, selectCartTotal,
  selectCartDiscount, clearCart,
} from '../redux/slices/cartSlice';
import API from '../utils/api';
import toast from 'react-hot-toast';

const STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh',
];

const emptyAddr = { fullName: '', phone: '', street: '', city: '', state: 'Karnataka', pincode: '', country: 'India' };

const Checkout = () => {
  const navigate  = useDispatch();
  const dispatch  = useDispatch();
  const nav       = useNavigate();
  const items     = useSelector(selectCartItems);
  const subtotal  = useSelector(selectCartSubtotal);
  const total     = useSelector(selectCartTotal);
  const discount  = useSelector(selectCartDiscount);
  const { coupon }  = useSelector(s => s.cart);
  const { user }    = useSelector(s => s.auth);
  const shipping    = subtotal > 500 ? 0 : 50;
  const tax         = Math.round(subtotal * 0.05);

  const savedAddresses = user?.addresses || [];
  const defaultAddr    = savedAddresses.find(a => a.isDefault) || savedAddresses[0];

  const [step,           setStep]           = useState(1);
  const [paymentMethod,  setPaymentMethod]  = useState('razorpay');
  const [loading,        setLoading]        = useState(false);
  const [useNewAddr,     setUseNewAddr]     = useState(savedAddresses.length === 0);
  const [selectedAddrId, setSelectedAddrId] = useState(defaultAddr?._id || null);
  const [newAddr,        setNewAddr]        = useState({
    ...emptyAddr,
    fullName: user?.name || '',
    phone:    user?.phone || '',
  });

  // Get the actual address to use for order
  const activeAddress = useNewAddr
    ? newAddr
    : (savedAddresses.find(a => a._id === selectedAddrId) || defaultAddr || newAddr);

  const validateAddress = () => {
    const a = activeAddress;
    if (!a.fullName) { toast.error('Full name is required'); return false; }
    if (!/^[6-9]\d{9}$/.test(a.phone)) { toast.error('Valid 10-digit phone required'); return false; }
    if (!a.street)   { toast.error('Street address is required'); return false; }
    if (!a.city)     { toast.error('City is required'); return false; }
    if (!a.state)    { toast.error('State is required'); return false; }
    if (!/^\d{6}$/.test(a.pincode)) { toast.error('Valid 6-digit pincode required'); return false; }
    return true;
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const { data } = await API.post('/orders/create', {
        items: items.map(i => ({ product: i.product, quantity: i.quantity })),
        shippingAddress: activeAddress,
        paymentMethod,
        couponCode: coupon,
      });
      const orderId = data.order._id;

      if (paymentMethod === 'razorpay') {
        const { data: payData } = await API.post('/payment/create-order', { orderId });
        const options = {
          key: payData.key, amount: payData.amount, currency: payData.currency,
          name: 'GreenRoots Organics', description: 'Organic Products',
          order_id: payData.razorpayOrderId,
          prefill: { name: user.name, email: user.email, contact: user.phone },
          theme: { color: '#2D6A4F' },
          handler: async (response) => {
            try {
              await API.post('/payment/verify', {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                orderId,
              });
              dispatch(clearCart());
              nav(`/order-success/${orderId}`);
            } catch { toast.error('Payment verification failed. Contact support.'); }
          },
          modal: { ondismiss: () => { setLoading(false); toast.error('Payment cancelled'); } },
        };
        const loadAndPay = () => { const rzp = new window.Razorpay(options); rzp.open(); };
        if (window.Razorpay) { loadAndPay(); }
        else {
          const s = document.createElement('script');
          s.src = 'https://checkout.razorpay.com/v1/checkout.js';
          s.onload = loadAndPay;
          document.body.appendChild(s);
        }
      } else {
        dispatch(clearCart());
        nav(`/order-success/${orderId}`);
      }
    } catch { setLoading(false); }
  };

  const steps = ['Address', 'Payment', 'Review'];

  return (
    <>
      <Helmet><title>Checkout — GreenRoots</title></Helmet>
      <div className="container" style={{ paddingTop: '32px', paddingBottom: '64px', maxWidth: '960px' }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '28px', fontFamily: 'Playfair Display,serif' }}>Checkout</h1>

        {/* Step bar */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
          {steps.map((s, i) => (
            <React.Fragment key={s}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.82rem', background: i+1 <= step ? '#2D6A4F' : '#E5E7EB', color: i+1 <= step ? 'white' : '#9CA3AF', flexShrink: 0 }}>
                  {i+1 < step ? <Check size={14}/> : i+1}
                </div>
                <span style={{ fontWeight: i+1 === step ? 700 : 400, color: i+1 <= step ? '#2D6A4F' : '#9CA3AF', fontSize: '0.88rem', whiteSpace: 'nowrap' }}>{s}</span>
              </div>
              {i < steps.length-1 && <div style={{ flex: 1, height: '2px', background: i+1 < step ? '#2D6A4F' : '#E5E7EB', margin: '0 10px' }}/>}
            </React.Fragment>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px', alignItems: 'start' }}>

          {/* ── Main Panel ── */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6' }}>

            {/* ── STEP 1: Address ── */}
            {step === 1 && (
              <>
                <h3 style={{ fontFamily: 'Inter,sans-serif', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={17} color="#2D6A4F"/> Delivery Address
                </h3>

                {/* Remote delivery notice */}
                <div style={{ background: '#F0FDF4', border: '1px solid #D1FAE5', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <MapPin size={16} color="#2D6A4F"/>
                  <p style={{ fontSize: '0.82rem', color: '#065F46', margin: 0, lineHeight: 1.5 }}>
                    <strong>We deliver to remote areas!</strong> Villages, hills, forests — wherever India Post reaches, we reach. Enter your complete address including landmark.
                  </p>
                </div>

                {/* Saved addresses */}
                {savedAddresses.length > 0 && (
                  <>
                    <p style={{ fontWeight: 600, fontSize: '0.85rem', color: '#374151', marginBottom: '12px' }}>Saved Addresses</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                      {savedAddresses.map(addr => (
                        <div key={addr._id}
                          onClick={() => { setSelectedAddrId(addr._id); setUseNewAddr(false); }}
                          style={{ padding: '14px 16px', border: `2px solid ${!useNewAddr && selectedAddrId === addr._id ? '#2D6A4F' : '#E5E7EB'}`, borderRadius: '12px', cursor: 'pointer', background: !useNewAddr && selectedAddrId === addr._id ? '#F0FDF4' : 'white', transition: 'all 0.2s', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                          <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid', borderColor: !useNewAddr && selectedAddrId === addr._id ? '#2D6A4F' : '#D1D5DB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                            {!useNewAddr && selectedAddrId === addr._id && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#2D6A4F' }}/>}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1B1B1B' }}>{addr.fullName}</span>
                              {addr.isDefault && (
                                <span style={{ background: '#D1FAE5', color: '#065F46', fontSize: '0.65rem', fontWeight: 700, padding: '2px 7px', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                  <Star size={9} fill="#065F46"/> DEFAULT
                                </span>
                              )}
                            </div>
                            <p style={{ fontSize: '0.82rem', color: '#6B7280', margin: 0, lineHeight: 1.6 }}>
                              {addr.street}, {addr.city}, {addr.state} — {addr.pincode}
                            </p>
                            <p style={{ fontSize: '0.8rem', color: '#9CA3AF', margin: '3px 0 0' }}>{addr.phone}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Use new address toggle */}
                    <button onClick={() => setUseNewAddr(!useNewAddr)}
                      style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '10px 16px', background: useNewAddr ? '#F0FDF4' : 'none', border: `1.5px dashed ${useNewAddr ? '#2D6A4F' : '#D1D5DB'}`, borderRadius: '10px', cursor: 'pointer', color: '#2D6A4F', fontWeight: 600, fontSize: '0.85rem', fontFamily: 'Inter,sans-serif', marginBottom: useNewAddr ? '16px' : '0', width: '100%', justifyContent: 'center' }}>
                      <Plus size={14}/> {useNewAddr ? 'Entering new address' : 'Deliver to a different address'}
                    </button>
                  </>
                )}

                {/* New address form */}
                <AnimatePresence>
                  {(useNewAddr || savedAddresses.length === 0) && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      style={{ overflow: 'hidden', marginTop: '16px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                        <div className="form-group">
                          <label className="form-label">Full Name *</label>
                          <input className="form-input" placeholder="Receiver's name" value={newAddr.fullName}
                            onChange={e => setNewAddr({ ...newAddr, fullName: e.target.value })}/>
                        </div>
                        <div className="form-group">
                          <label className="form-label">Phone *</label>
                          <input className="form-input" placeholder="10-digit mobile" value={newAddr.phone}
                            onChange={e => setNewAddr({ ...newAddr, phone: e.target.value.replace(/\D/g,'').slice(0,10) })}/>
                        </div>
                        <div className="form-group" style={{ gridColumn: '1/-1' }}>
                          <label className="form-label">Street / Village / Area *</label>
                          <textarea className="form-input" placeholder="House no., street, village, landmark..." value={newAddr.street}
                            style={{ minHeight: '68px', resize: 'vertical' }}
                            onChange={e => setNewAddr({ ...newAddr, street: e.target.value })}/>
                        </div>
                        <div className="form-group">
                          <label className="form-label">City / Town / Village *</label>
                          <input className="form-input" placeholder="City or village name" value={newAddr.city}
                            onChange={e => setNewAddr({ ...newAddr, city: e.target.value })}/>
                        </div>
                        <div className="form-group">
                          <label className="form-label">Pincode *</label>
                          <input className="form-input" placeholder="6-digit pincode" value={newAddr.pincode}
                            onChange={e => setNewAddr({ ...newAddr, pincode: e.target.value.replace(/\D/g,'').slice(0,6) })}/>
                        </div>
                        <div className="form-group" style={{ gridColumn: '1/-1' }}>
                          <label className="form-label">State *</label>
                          <select className="form-input" value={newAddr.state}
                            onChange={e => setNewAddr({ ...newAddr, state: e.target.value })}>
                            <option value="">Select state</option>
                            {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button onClick={() => { if (validateAddress()) setStep(2); }}
                  style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '8px', padding: '13px 28px', background: '#2D6A4F', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontSize: '0.95rem' }}>
                  Continue to Payment <ChevronRight size={16}/>
                </button>
              </>
            )}

            {/* ── STEP 2: Payment ── */}
            {step === 2 && (
              <>
                <h3 style={{ fontFamily: 'Inter,sans-serif', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CreditCard size={17} color="#2D6A4F"/> Payment Method
                </h3>
                {[
                  { value: 'razorpay', Icon: CreditCard, label: 'Online Payment', desc: 'UPI, Card, Net Banking, Wallet — powered by Razorpay' },
                  { value: 'cod',      Icon: Banknote,   label: 'Cash on Delivery', desc: 'Pay when your order arrives at your doorstep' },
                ].map(({ value, Icon, label, desc }) => (
                  <div key={value} onClick={() => setPaymentMethod(value)}
                    style={{ display: 'flex', gap: '14px', padding: '16px', border: `2px solid ${paymentMethod === value ? '#2D6A4F' : '#E5E7EB'}`, borderRadius: '12px', marginBottom: '12px', cursor: 'pointer', background: paymentMethod === value ? '#F0FDF4' : 'white', transition: 'all 0.2s', alignItems: 'center' }}>
                    <div style={{ background: paymentMethod === value ? '#D1FAE5' : '#F3F4F6', borderRadius: '10px', padding: '10px', flexShrink: 0 }}>
                      <Icon size={20} color={paymentMethod === value ? '#2D6A4F' : '#9CA3AF'}/>
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 700, fontSize: '0.93rem', margin: 0 }}>{label}</p>
                      <p style={{ color: '#6B7280', fontSize: '0.82rem', margin: '3px 0 0' }}>{desc}</p>
                    </div>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid', borderColor: paymentMethod === value ? '#2D6A4F' : '#D1D5DB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {paymentMethod === value && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#2D6A4F' }}/>}
                    </div>
                  </div>
                ))}
                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                  <button onClick={() => setStep(1)} style={{ padding: '12px 20px', background: 'none', border: '1.5px solid #E5E7EB', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, color: '#6B7280', fontFamily: 'Inter,sans-serif' }}>← Back</button>
                  <button onClick={() => setStep(3)} style={{ flex: 1, padding: '12px', background: '#2D6A4F', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter,sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    Review Order <ChevronRight size={15}/>
                  </button>
                </div>
              </>
            )}

            {/* ── STEP 3: Review ── */}
            {step === 3 && (
              <>
                <h3 style={{ fontFamily: 'Inter,sans-serif', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Package size={17} color="#2D6A4F"/> Review Your Order
                </h3>

                {/* Address summary */}
                <div style={{ background: '#F8FFF4', borderRadius: '10px', padding: '14px 16px', marginBottom: '14px', border: '1px solid #D1FAE5' }}>
                  <p style={{ fontWeight: 700, fontSize: '0.82rem', color: '#2D6A4F', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <MapPin size={12}/> DELIVERY ADDRESS
                  </p>
                  <p style={{ color: '#374151', fontSize: '0.9rem', fontWeight: 600 }}>{activeAddress.fullName} · {activeAddress.phone}</p>
                  <p style={{ color: '#6B7280', fontSize: '0.85rem', marginTop: '2px', lineHeight: 1.6 }}>
                    {activeAddress.street}, {activeAddress.city}, {activeAddress.state} — {activeAddress.pincode}
                  </p>
                </div>

                {/* Items */}
                <div style={{ background: '#F9FAFB', borderRadius: '10px', padding: '14px 16px', marginBottom: '20px' }}>
                  <p style={{ fontWeight: 700, fontSize: '0.82rem', color: '#374151', marginBottom: '12px' }}>ORDER ITEMS ({items.length})</p>
                  {items.map(item => (
                    <div key={item.product} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                      <img src={item.image || '/placeholder.jpg'} alt={item.name}
                        style={{ width: '46px', height: '46px', objectFit: 'cover', borderRadius: '8px', background: '#F3F4F6' }}/>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 600, fontSize: '0.88rem', margin: 0 }}>{item.name}</p>
                        <p style={{ color: '#9CA3AF', fontSize: '0.78rem', margin: '2px 0 0' }}>Qty: {item.quantity} × ₹{item.price}</p>
                      </div>
                      <span style={{ fontWeight: 700, color: '#2D6A4F', fontSize: '0.92rem' }}>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => setStep(2)} style={{ padding: '12px 20px', background: 'none', border: '1.5px solid #E5E7EB', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, color: '#6B7280', fontFamily: 'Inter,sans-serif' }}>← Back</button>
                  <button onClick={handlePlaceOrder} disabled={loading}
                    style={{ flex: 1, padding: '13px', background: '#2D6A4F', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Inter,sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: loading ? 0.7 : 1 }}>
                    {loading
                      ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }}/> Processing...</>
                      : paymentMethod === 'cod'
                        ? <><Check size={16}/> Place Order</>
                        : <><CreditCard size={16}/> Pay ₹{total}</>
                    }
                  </button>
                </div>
              </>
            )}
          </div>

          {/* ── Order Summary Sidebar ── */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '22px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', position: 'sticky', top: '80px', border: '1px solid #F3F4F6' }}>
            <h3 style={{ fontFamily: 'Inter,sans-serif', fontWeight: 700, marginBottom: '16px', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#6B7280' }}>
              Order Summary
            </h3>
            {[
              ['Subtotal',   `₹${subtotal}`],
              ['Delivery',   shipping === 0 ? 'FREE' : `₹${shipping}`],
              ['GST (5%)',   `₹${tax}`],
              ...(discount > 0 ? [['Discount', `-₹${discount}`]] : []),
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.88rem', color: '#374151' }}>
                <span>{label}</span>
                <span style={{ fontWeight: 500, color: value === 'FREE' || value.startsWith('-') ? '#22C55E' : 'inherit' }}>{value}</span>
              </div>
            ))}
            <div style={{ borderTop: '2px solid #F3F4F6', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.05rem', marginBottom: '16px' }}>
              <span>Total</span><span style={{ color: '#2D6A4F' }}>₹{total}</span>
            </div>
            <div style={{ background: '#F0FDF4', borderRadius: '8px', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={14} color="#2D6A4F"/>
              <p style={{ fontSize: '0.76rem', color: '#065F46', margin: 0 }}>Secured by SSL encryption</p>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .container > div[style*="grid-template-columns: 1fr 300px"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
};

export default Checkout;
