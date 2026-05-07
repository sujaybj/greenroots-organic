import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MapPin, CreditCard, Banknote, Loader2, ShieldCheck, Check } from 'lucide-react';
import {
  selectCartItems,
  selectCartSubtotal,
  selectCartTotal,
  selectCartDiscount,
  clearCart,
} from '../redux/slices/cartSlice';
import API from '../utils/api';
import toast from 'react-hot-toast';
import BackNav from '../components/common/BackNav';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const total = useSelector(selectCartTotal);
  const discount = useSelector(selectCartDiscount);
  const { coupon } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const shipping = subtotal > 500 ? 0 : 50;

  const [address, setAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  });
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const { data } = await API.post('/orders/create', {
        items: items.map((i) => ({ product: i.product, quantity: i.quantity })),
        shippingAddress: address,
        paymentMethod,
        couponCode: coupon,
      });
      const orderId = data.order._id;

      if (paymentMethod === 'razorpay') {
        const { data: payData } = await API.post('/payment/create-order', { orderId });

        const options = {
          key: payData.key,
          amount: payData.amount,
          currency: payData.currency,
          name: 'GreenRoots Organics',
          description: 'Organic Products Payment',
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
              navigate(`/order-success/${orderId}`);
            } catch {
              toast.error('Payment verification failed. Contact support.');
            }
          },
          modal: {
            ondismiss: () => {
              setLoading(false);
              toast.error('Payment cancelled');
            },
          },
        };

        if (window.Razorpay) {
          const rzp = new window.Razorpay(options);
          rzp.open();
        } else {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => {
            const rzp = new window.Razorpay(options);
            rzp.open();
          };
          document.body.appendChild(script);
        }
      } else {
        dispatch(clearCart());
        navigate(`/order-success/${orderId}`);
      }
    } catch {
      setLoading(false);
      toast.error('Could not place order right now. Please try again.');
    }
  };

  const steps = ['Address', 'Payment', 'Review'];

  return (
    <>
      <Helmet><title>Checkout - GreenRoots</title></Helmet>
      <div className="container checkout-page" style={{ paddingTop: '32px', paddingBottom: '64px', maxWidth: '900px' }}>
        <div style={{ marginBottom: '10px' }}>
          <BackNav label="Back" fallback="/cart" />
        </div>
        <h1 style={{ fontSize: isMobile ? '1.75rem' : '2rem', marginBottom: '32px' }}>Checkout</h1>

        <div style={{ display: 'flex', alignItems: isMobile ? 'stretch' : 'center', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '12px' : '0', marginBottom: '40px' }}>
          {steps.map((s, i) => (
            <React.Fragment key={s}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: isMobile ? '100%' : 'auto' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', background: i + 1 <= step ? '#2D6A4F' : '#E5E7EB', color: i + 1 <= step ? 'white' : '#9CA3AF' }}>
                  {i + 1 < step ? <Check size={14} /> : i + 1}
                </div>
                <span style={{ fontWeight: i + 1 === step ? 700 : 400, color: i + 1 <= step ? '#2D6A4F' : '#9CA3AF', fontSize: '0.9rem' }}>{s}</span>
              </div>
              {i < steps.length - 1 && (
                <div
                  style={{
                    flex: isMobile ? 'none' : 1,
                    width: isMobile ? '2px' : 'auto',
                    alignSelf: isMobile ? 'flex-start' : 'auto',
                    margin: isMobile ? '0 0 0 15px' : '0 8px',
                    height: isMobile ? '16px' : '2px',
                    background: i + 1 < step ? '#2D6A4F' : '#E5E7EB',
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="checkout-layout" style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'minmax(0,1fr) 320px', gap: isMobile ? '18px' : '32px', alignItems: 'start' }}>
          <div className="checkout-main-card" style={{ background: 'white', borderRadius: '16px', padding: isMobile ? '18px' : '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            {step === 1 && (
              <>
                <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, marginBottom: '20px' }}>Delivery Address</h3>
                <button
                  type="button"
                  onClick={() => {
                    if (!navigator.geolocation) {
                      toast.error('Location not supported by your browser');
                      return;
                    }
                    toast.loading('Detecting your location...');
                    navigator.geolocation.getCurrentPosition(
                      async (pos) => {
                        toast.dismiss();
                        try {
                          const { latitude, longitude } = pos.coords;
                          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
                          const geo = await res.json();
                          const addr = geo.address || {};
                          setAddress((a) => ({
                            ...a,
                            street: [addr.road, addr.suburb, addr.neighbourhood].filter(Boolean).join(', ') || a.street,
                            city: addr.city || addr.town || addr.village || addr.county || a.city,
                            state: addr.state || a.state,
                            pincode: addr.postcode || a.pincode,
                          }));
                          toast.success('Location detected! Please verify and complete.');
                        } catch {
                          toast.error('Could not fetch address. Please enter manually.');
                        }
                      },
                      () => {
                        toast.dismiss();
                        toast.error('Location permission denied.');
                      }
                    );
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: '#F0FDF4', color: '#2D6A4F', border: '1.5px solid #D1FAE5', borderRadius: '9px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', fontFamily: 'Inter,sans-serif', marginBottom: '18px', width: '100%', justifyContent: 'center' }}
                >
                  <MapPin size={15} /> Use My Current Location
                </button>
                <div className="checkout-two-col" style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px' }}>
                  {[['fullName', 'Full Name *', 'text', 'John Doe'], ['phone', 'Phone Number *', 'tel', '+91 9876543210']].map(([key, label, type, placeholder]) => (
                    <div key={key} className="form-group">
                      <label className="form-label">{label}</label>
                      <input type={type} className="form-input" placeholder={placeholder} value={address[key]} onChange={(e) => setAddress({ ...address, [key]: e.target.value })} />
                    </div>
                  ))}
                </div>
                <div className="form-group">
                  <label className="form-label">Street Address *</label>
                  <input className="form-input" placeholder="123 Main Street, Koramangala" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} />
                </div>
                <div className="checkout-three-col" style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '16px' }}>
                  {[['city', 'City *', 'Bangalore'], ['state', 'State *', 'Karnataka'], ['pincode', 'Pincode *', '560034']].map(([key, label, placeholder]) => (
                    <div key={key} className="form-group">
                      <label className="form-label">{label}</label>
                      <input className="form-input" placeholder={placeholder} value={address[key]} onChange={(e) => setAddress({ ...address, [key]: e.target.value })} />
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => {
                    if (!address.fullName || !address.phone || !address.street || !address.city || !address.state || !address.pincode) {
                      toast.error('Please fill all required fields');
                      return;
                    }
                    setStep(2);
                  }}
                  className="btn btn-primary btn-lg"
                  style={{ width: isMobile ? '100%' : 'auto' }}
                >
                  Continue to Payment
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, marginBottom: '20px' }}>Payment Method</h3>
                {[
                  ['razorpay', CreditCard, 'Razorpay', 'Pay securely with UPI, Card, Net Banking, Wallet'],
                  ['cod', Banknote, 'Cash on Delivery', 'Pay when you receive your order'],
                ].map(([value, Icon, label, desc]) => (
                  <div
                    key={value}
                    onClick={() => setPaymentMethod(value)}
                    className="checkout-payment-option"
                    style={{ display: 'flex', gap: '14px', padding: '16px', border: `2px solid ${paymentMethod === value ? '#2D6A4F' : '#E5E7EB'}`, borderRadius: '12px', marginBottom: '12px', cursor: 'pointer', background: paymentMethod === value ? '#F0FDF4' : 'white' }}
                  >
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={18} color="#2D6A4F" />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontWeight: 700 }}>{label}</p>
                      <p style={{ color: '#6B7280', fontSize: '0.85rem', marginTop: '3px' }}>{desc}</p>
                    </div>
                    <div style={{ marginLeft: 'auto', width: '20px', height: '20px', borderRadius: '50%', border: '2px solid', borderColor: paymentMethod === value ? '#2D6A4F' : '#E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '4px' }}>
                      {paymentMethod === value && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#2D6A4F' }} />}
                    </div>
                  </div>
                ))}
                <div className="checkout-actions" style={{ display: 'flex', gap: '12px', marginTop: '20px', flexDirection: isMobile ? 'column-reverse' : 'row' }}>
                  <button onClick={() => setStep(1)} className="btn btn-outline">Back</button>
                  <button onClick={() => setStep(3)} className="btn btn-primary btn-lg" style={{ flex: 1 }}>Review Order</button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, marginBottom: '20px' }}>Review Your Order</h3>
                <div style={{ background: '#F9FAFB', borderRadius: '10px', padding: '16px', marginBottom: '20px' }}>
                  <h4 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, marginBottom: '8px', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} /> Delivery Address</h4>
                  <p style={{ color: '#374151', fontSize: '0.9rem' }}>{address.fullName} • {address.phone}</p>
                  <p style={{ color: '#6B7280', fontSize: '0.88rem' }}>{address.street}, {address.city}, {address.state} - {address.pincode}</p>
                </div>
                <div style={{ background: '#F9FAFB', borderRadius: '10px', padding: '16px', marginBottom: '20px' }}>
                  <h4 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, marginBottom: '12px', fontSize: '0.9rem' }}>Order Items ({items.length})</h4>
                  {items.map((item) => (
                    <div key={item.product} className="checkout-review-item" style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '10px' }}>
                      <img src={item.image} alt={item.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.name}</p>
                        <p style={{ color: '#6B7280', fontSize: '0.8rem' }}>Qty: {item.quantity} × ₹{item.price}</p>
                      </div>
                      <span style={{ fontWeight: 700, color: '#2D6A4F', fontSize: '0.95rem', flexShrink: 0 }}>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="checkout-actions" style={{ display: 'flex', gap: '12px', flexDirection: isMobile ? 'column-reverse' : 'row' }}>
                  <button onClick={() => setStep(2)} className="btn btn-outline">Back</button>
                  <button onClick={handlePlaceOrder} disabled={loading} className="btn btn-primary btn-lg" style={{ flex: 1, fontSize: '1rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '7px' }}>
                    {loading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Processing...</> : paymentMethod === 'cod' ? <><Check size={15} /> Place Order</> : <><CreditCard size={15} /> Pay Now</>}
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="checkout-summary-card" style={{ background: 'white', borderRadius: '16px', padding: isMobile ? '18px' : '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', position: isMobile ? 'static' : 'sticky', top: '80px', order: isMobile ? -1 : 0 }}>
            <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, marginBottom: '16px' }}>Order Summary</h3>
            {[['Subtotal (GST incl.)', `₹${subtotal}`], ['Shipping', shipping === 0 ? 'FREE' : `₹${shipping}`], ...(discount > 0 ? [['Discount', `-₹${discount}`]] : [])].map(([label, value]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.87rem', color: '#374151' }}>
                <span>{label}</span>
                <span style={{ color: value === 'FREE' || String(value).startsWith('-') ? '#22C55E' : 'inherit', fontWeight: 500 }}>{value}</span>
              </div>
            ))}
            <div style={{ borderTop: '1.5px solid #E5E7EB', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.05rem', marginBottom: '6px' }}>
              <span>Total</span>
              <span style={{ color: '#2D6A4F' }}>₹{total}</span>
            </div>
            <p style={{ fontSize: '0.7rem', color: '#9CA3AF', marginBottom: '12px' }}>* All prices include GST</p>
            <div style={{ background: '#F0FDF4', borderRadius: '8px', padding: '12px', marginTop: '4px', display: 'grid', gap: '10px', color: '#065F46', fontSize: '0.8rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', width: '100%' }}><ShieldCheck size={14} /> Secured by SSL encryption</div>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', width: '100%' }}><Banknote size={14} /> You saved ₹{discount + (shipping === 0 ? 50 : 0)} on this order</div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .checkout-page {
            padding-top: 24px !important;
            padding-bottom: 40px !important;
          }

          .checkout-layout {
            gap: 16px !important;
          }

          .checkout-main-card,
          .checkout-summary-card {
            padding: 16px !important;
            border-radius: 14px !important;
          }

          .checkout-two-col,
          .checkout-three-col {
            grid-template-columns: 1fr !important;
          }

          .checkout-payment-option {
            align-items: flex-start !important;
          }

          .checkout-actions {
            flex-direction: column-reverse !important;
          }

          .checkout-actions .btn {
            width: 100% !important;
          }

          .checkout-review-item {
            align-items: flex-start !important;
            flex-wrap: wrap !important;
          }

          .checkout-review-item > span {
            width: 100%;
            margin-left: 60px;
          }
        }

        @media (max-width: 480px) {
          .checkout-payment-option {
            padding: 14px !important;
            gap: 10px !important;
          }

          .checkout-payment-option p {
            word-break: break-word;
          }

          .checkout-review-item > span {
            margin-left: 0;
          }
        }
      `}</style>
    </>
  );
};

export default Checkout;
